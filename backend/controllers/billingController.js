import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all products (for search/barcode scan)
export const getShopProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { isAvailable: true }
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new store bill
export const createBill = async (req, res) => {
    try {
        const {
            customerName,
            customerPhone,
            customerGst,
            items,
            subtotal,
            discount,
            totalGst,
            grandTotal,
            paymentMethod
        } = req.body;

        // Generate invoice number: LB-YYYYMMDD-XXXX
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');

        // Find count of bills today for increment
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const todayCount = await prisma.storeBill.count({
            where: {
                createdAt: {
                    gte: startOfToday
                }
            }
        });

        const invoiceNumber = `LB-${dateStr}-${(todayCount + 1).toString().padStart(4, '0')}`;

        const bill = await prisma.storeBill.create({
            data: {
                invoiceNumber,
                customerName,
                customerPhone,
                customerGst,
                subtotal,
                discount,
                totalGst,
                grandTotal,
                paymentMethod,
                items
            }
        });

        res.status(201).json(bill);
    } catch (error) {
        console.error('Create Bill Error:', error);
        res.status(500).json({ message: 'Failed to save bill: ' + error.message });
    }
};

// Get daily report
export const getDailyReport = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const bills = await prisma.storeBill.findMany({
            where: {
                createdAt: {
                    gte: startOfDay
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const summary = bills.reduce((acc, bill) => {
            acc.totalSales += bill.grandTotal;
            acc.totalGst += bill.totalGst;
            acc.billCount += 1;
            return acc;
        }, { totalSales: 0, totalGst: 0, billCount: 0 });

        res.status(200).json({
            summary,
            bills
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Seed mock products for testing barcode scanning
export const seedProducts = async (req, res) => {
    const mockProducts = [
        { name: 'Red Velvet Cake', barcode: '890123456789', price: 550, category: 'cake', gst: 18, isAvailable: true },
        { name: 'Chocolate Truffle Cake', barcode: '890123456790', price: 650, category: 'cake', gst: 18, isAvailable: true },
        { name: 'Butter Croissant', barcode: '890123456791', price: 80, category: 'snack', gst: 5, isAvailable: true },
        { name: 'Chocolate Chip Cookie', barcode: '890123456792', price: 25, category: 'cookie', gst: 5, isAvailable: true },
        { name: 'Blueberry Muffin', barcode: '890123456793', price: 75, category: 'pastry', gst: 12, isAvailable: true },
        { name: 'Cappuccino', barcode: '890123456794', price: 120, category: 'beverage', gst: 18, isAvailable: true },
    ];

    try {
        for (const p of mockProducts) {
            await prisma.product.upsert({
                where: { barcode: p.barcode },
                update: p,
                create: p
            });
        }
        res.status(200).json({ message: 'Mock products seeded successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
