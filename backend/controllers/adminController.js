import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, todayOrders, totalUsers, totalProducts, revenueAgg] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { createdAt: { gte: today } } }),
        prisma.user.count({ where: { role: 'user' } }),
        prisma.product.count({ where: { isAvailable: true } }),
        prisma.order.aggregate({
            _sum: { totalPrice: true },
            where: { orderStatus: { not: 'cancelled' } }
        }),
    ]);

    const totalRevenue = revenueAgg._sum.totalPrice || 0;

    // Daily sales last 7 days
    const last7 = new Date();
    last7.setDate(last7.getDate() - 7);

    // In PostgreSQL, use TO_CHAR to format date. Prisma $queryRaw returns BigInt for count, so map it to Number.
    const dailySalesRaw = await prisma.$queryRaw`
        SELECT TO_CHAR("createdAt", 'YYYY-MM-DD') as "_id",
               SUM("totalPrice") as "revenue",
               COUNT(*) as "count"
        FROM "Order"
        WHERE "createdAt" >= ${last7} AND "orderStatus" != 'cancelled'
        GROUP BY TO_CHAR("createdAt", 'YYYY-MM-DD')
        ORDER BY TO_CHAR("createdAt", 'YYYY-MM-DD') ASC
    `;

    const dailySales = dailySalesRaw.map(d => ({
        _id: d._id,
        revenue: Number(d.revenue),
        count: Number(d.count)
    }));

    // Popular products (top 5 by order count)
    const popularProductsRaw = await prisma.$queryRaw`
        SELECT "productId" as "_id", p."name" as "name", SUM("quantity") as "count"
        FROM "OrderItem" oi
        JOIN "Product" p ON p."id" = oi."productId"
        GROUP BY "productId", p."name"
        ORDER BY "count" DESC
        LIMIT 5
    `;

    const popularProducts = popularProductsRaw.map(p => ({
        _id: p._id,
        name: p.name,
        count: Number(p.count)
    }));

    res.json({ totalOrders, todayOrders, totalUsers, totalProducts, totalRevenue, dailySales, popularProducts });
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    // Select all fields except password
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            role: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
    });

    // Map id to _id
    res.json(users.map(u => ({ ...u, _id: u.id })));
});
