import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';
import { sendAdminWhatsAppNotification } from '../services/whatsappService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
    const { items, deliveryAddress, deliveryDate, deliveryTime, paymentMethod, totalPrice } = req.body;
    if (!items || items.length === 0) {
        res.status(400); throw new Error('No order items');
    }

    // Convert Mongoose incoming models to Prisma expected relational format
    const orderItemsCreate = items.map(item => ({
        productId: item.product,
        size: item.size || null,
        quantity: item.quantity,
        price: item.price,
        message: item.message || null,
        customizations: item.customizations || {},
    }));

    const order = await prisma.order.create({
        data: {
            userId: req.user.id || req.user._id,
            totalPrice,
            deliveryAddress: deliveryAddress, // JSON field
            deliveryDate: new Date(deliveryDate),
            deliveryTime,
            paymentMethod,
            items: {
                create: orderItemsCreate
            }
        },
        include: { items: true, user: true }
    });

    if (paymentMethod === 'cod') {
        try {
            await sendOrderConfirmationEmail(req.user.email, req.user.name, order);
            await sendAdminWhatsAppNotification(order, req.user);
            console.log(`COD Order notifications sent for order: ${order.id}`);
        } catch (e) {
            console.error('Notification failed for order:', order.id);
            console.error(e);
        }
    }

    res.status(201).json({ ...order, _id: order.id });
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
    let orders = await prisma.order.findMany({
        where: { userId: req.user.id || req.user._id },
        orderBy: { createdAt: 'desc' },
        include: { items: true }
    });
    res.json(orders.map(o => ({ ...o, _id: o.id })));
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: { user: { select: { id: true, name: true, email: true, phone: true } }, items: true }
    });
    if (order) {
        if (order.user) order.user._id = order.user.id;
        res.json({ ...order, _id: order.id });
    }
    else { res.status(404); throw new Error('Order not found'); }
});

// @desc    Get ALL orders (admin)
// @route   GET /api/orders/admin
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;
    const whereClause = status ? { orderStatus: status } : {};

    const count = await prisma.order.count({ where: whereClause });
    let orders = await prisma.order.findMany({
        where: whereClause,
        include: { user: { select: { id: true, name: true, email: true, phone: true } }, items: true },
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
        skip: Number(limit) * (Number(page) - 1)
    });

    orders = orders.map(order => {
        if (order.user) order.user._id = order.user.id;
        return { ...order, _id: order.id };
    });
    res.json({ orders, total: count });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const orderExists = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (orderExists) {
        let paymentStatus = orderExists.paymentStatus;
        if (req.body.orderStatus === 'delivered') {
            paymentStatus = 'paid';
        }

        const updated = await prisma.order.update({
            where: { id: req.params.id },
            data: {
                orderStatus: req.body.orderStatus || orderExists.orderStatus,
                paymentStatus
            },
            include: { user: { select: { id: true, name: true, email: true } }, items: true }
        });

        if (updated.user) updated.user._id = updated.user.id;
        res.json({ ...updated, _id: updated.id });
    } else { res.status(404); throw new Error('Order not found'); }
});
