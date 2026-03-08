import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, todayOrders, totalUsers, totalProducts, revenueAgg] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ createdAt: { $gte: today } }),
        User.countDocuments({ role: 'user' }),
        Product.countDocuments({ isAvailable: true }),
        Order.aggregate([
            { $match: { orderStatus: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    // Daily sales last 7 days
    const last7 = new Date();
    last7.setDate(last7.getDate() - 7);
    const dailySales = await Order.aggregate([
        { $match: { createdAt: { $gte: last7 }, orderStatus: { $ne: 'cancelled' } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                revenue: { $sum: '$totalPrice' },
                count: { $sum: 1 },
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Popular products (top 5 by order count)
    const popularProducts = await Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.product', name: { $first: '$items.name' }, count: { $sum: '$items.quantity' } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    res.json({ totalOrders, todayOrders, totalUsers, totalProducts, totalRevenue, dailySales, popularProducts });
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
});
