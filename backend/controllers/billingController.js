import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Generate a unique bill number like LB/2026/00042
const generateBillNumber = async () => {
    const year = new Date().getFullYear();
    const count = await prisma.bill.count();
    const seq = String(count + 1).padStart(5, '0');
    return `LB/${year}/${seq}`;
};

// POST /api/billing — Save a new bill
export const createBill = async (req, res) => {
    try {
        const { customerName, customerPhone, items, subtotal, discountAmt, gstAmt, grandTotal, gstRate, notes } = req.body;
        const billNumber = await generateBillNumber();

        const bill = await prisma.bill.create({
            data: {
                billNumber,
                customerName: customerName || null,
                customerPhone: customerPhone || null,
                items,
                subtotal: parseFloat(subtotal),
                discountAmt: parseFloat(discountAmt || 0),
                gstAmt: parseFloat(gstAmt),
                grandTotal: parseFloat(grandTotal),
                gstRate: parseFloat(gstRate || 18),
                notes: notes || null,
            },
        });

        res.status(201).json({ success: true, bill });
    } catch (err) {
        console.error('createBill error:', err);
        res.status(500).json({ message: 'Failed to save bill.' });
    }
};

// GET /api/billing — List bills (filter by date/customer)
export const getBills = async (req, res) => {
    try {
        const { customer, date, limit = 50, skip = 0 } = req.query;

        const where = {};
        if (customer) {
            where.OR = [
                { customerName: { contains: customer, mode: 'insensitive' } },
                { customerPhone: { contains: customer } },
            ];
        }
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            where.createdAt = { gte: start, lte: end };
        }

        const [bills, total] = await Promise.all([
            prisma.bill.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: parseInt(limit),
                skip: parseInt(skip),
            }),
            prisma.bill.count({ where }),
        ]);

        res.json({ success: true, bills, total });
    } catch (err) {
        console.error('getBills error:', err);
        res.status(500).json({ message: 'Failed to fetch bills.' });
    }
};

// GET /api/billing/:id — Single bill for reprint
export const getBillById = async (req, res) => {
    try {
        const bill = await prisma.bill.findUnique({ where: { id: req.params.id } });
        if (!bill) return res.status(404).json({ message: 'Bill not found.' });
        res.json({ success: true, bill });
    } catch (err) {
        console.error('getBillById error:', err);
        res.status(500).json({ message: 'Failed to fetch bill.' });
    }
};

// GET /api/billing/summary/today — Daily summary stats
export const getDailySummary = async (req, res) => {
    try {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const bills = await prisma.bill.findMany({
            where: { createdAt: { gte: start, lte: end } },
        });

        const totalBills = bills.length;
        const totalRevenue = bills.reduce((s, b) => s + b.grandTotal, 0);
        const totalGST = bills.reduce((s, b) => s + b.gstAmt, 0);
        const totalDiscount = bills.reduce((s, b) => s + b.discountAmt, 0);

        res.json({ success: true, totalBills, totalRevenue, totalGST, totalDiscount });
    } catch (err) {
        console.error('getDailySummary error:', err);
        res.status(500).json({ message: 'Failed to fetch daily summary.' });
    }
};
