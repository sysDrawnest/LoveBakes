import Order from '../models/Order.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
    const { items, deliveryAddress, deliveryDate, deliveryTime, paymentMethod, totalPrice } = req.body;
    if (!items || items.length === 0) {
        res.status(400); throw new Error('No order items');
    }
    const order = await Order.create({
        user: req.user._id,
        items,
        deliveryAddress,
        deliveryDate,
        deliveryTime,
        paymentMethod,
        totalPrice,
    });

    // Send confirmation email (best effort)
    try {
        await sendOrderConfirmationEmail(req.user.email, req.user.name, order);
    } catch (e) { console.log('Email error:', e.message); }

    res.status(201).json(order);
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (order) res.json(order);
    else { res.status(404); throw new Error('Order not found'); }
});

// @desc    Get ALL orders (admin)
// @route   GET /api/orders/admin
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { orderStatus: status } : {};
    const count = await Order.countDocuments(query);
    const orders = await Order.find(query)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(Number(limit) * (Number(page) - 1));
    res.json({ orders, total: count });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
        order.orderStatus = req.body.orderStatus || order.orderStatus;
        if (req.body.orderStatus === 'delivered') {
            order.paymentStatus = 'paid';
        }
        const updated = await order.save();
        res.json(updated);
    } else { res.status(404); throw new Error('Order not found'); }
});
