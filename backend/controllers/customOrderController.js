import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Submit custom cake request
// @route   POST /api/custom-orders
// @access  Private
export const createCustomOrder = asyncHandler(async (req, res) => {
    const { flavor, size, shape, frosting, icingColor, toppings, message, deliveryDate, specialInstructions, referenceImage } = req.body;
    const customOrder = await prisma.customOrder.create({
        data: {
            userId: req.user.id || req.user._id,
            flavor,
            size,
            shape,
            frosting,
            icingColor,
            toppings: toppings || [],
            message,
            deliveryDate: new Date(deliveryDate),
            specialInstructions,
            referenceImage: referenceImage || '',
        }
    });
    res.status(201).json({ ...customOrder, _id: customOrder.id });
});

// @desc    Get user's custom orders
// @route   GET /api/custom-orders/mine
// @access  Private
export const getMyCustomOrders = asyncHandler(async (req, res) => {
    const orders = await prisma.customOrder.findMany({
        where: { userId: req.user.id || req.user._id },
        orderBy: { createdAt: 'desc' }
    });
    res.json(orders.map(o => ({ ...o, _id: o.id })));
});

// @desc    Get all custom orders (admin)
// @route   GET /api/custom-orders/admin
// @access  Private/Admin
export const getAllCustomOrders = asyncHandler(async (req, res) => {
    const orders = await prisma.customOrder.findMany({
        include: { user: { select: { id: true, name: true, email: true, phone: true } } },
        orderBy: { createdAt: 'desc' }
    });
    res.json(orders.map(order => {
        if (order.user) order.user._id = order.user.id;
        return { ...order, _id: order.id };
    }));
});

// @desc    Set price and approve custom order (admin)
// @route   PUT /api/custom-orders/:id/approve
// @access  Private/Admin
export const approveCustomOrder = asyncHandler(async (req, res) => {
    const orderExists = await prisma.customOrder.findUnique({ where: { id: req.params.id } });
    if (orderExists) {
        const updated = await prisma.customOrder.update({
            where: { id: req.params.id },
            data: { quotedPrice: Number(req.body.quotedPrice), status: 'quoted' }
        });
        res.json({ ...updated, _id: updated.id });
    } else { res.status(404); throw new Error('Custom order not found'); }
});
