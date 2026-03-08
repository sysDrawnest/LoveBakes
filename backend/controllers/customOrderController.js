import CustomOrder from '../models/CustomOrder.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Submit custom cake request
// @route   POST /api/custom-orders
// @access  Private
export const createCustomOrder = asyncHandler(async (req, res) => {
    const { flavor, size, shape, frosting, icingColor, toppings, message, deliveryDate, specialInstructions } = req.body;
    const customOrder = await CustomOrder.create({
        user: req.user._id,
        flavor, size, shape, frosting, icingColor, toppings, message, deliveryDate, specialInstructions,
        referenceImage: req.body.referenceImage || '',
    });
    res.status(201).json(customOrder);
});

// @desc    Get user's custom orders
// @route   GET /api/custom-orders/mine
// @access  Private
export const getMyCustomOrders = asyncHandler(async (req, res) => {
    const orders = await CustomOrder.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Get all custom orders (admin)
// @route   GET /api/custom-orders/admin
// @access  Private/Admin
export const getAllCustomOrders = asyncHandler(async (req, res) => {
    const orders = await CustomOrder.find({}).populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Set price and approve custom order (admin)
// @route   PUT /api/custom-orders/:id/approve
// @access  Private/Admin
export const approveCustomOrder = asyncHandler(async (req, res) => {
    const order = await CustomOrder.findById(req.params.id);
    if (order) {
        order.quotedPrice = req.body.quotedPrice;
        order.status = 'quoted';
        const updated = await order.save();
        res.json(updated);
    } else { res.status(404); throw new Error('Custom order not found'); }
});
