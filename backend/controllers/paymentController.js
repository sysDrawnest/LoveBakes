import Razorpay from 'razorpay';
import crypto from 'crypto';
import asyncHandler from '../utils/asyncHandler.js';
<<<<<<< HEAD
import prisma from '../config/prisma.js';
=======
import Order from '../models/Order.js';
>>>>>>> efde3d12d5492354106b7066d2592d0917893253
import { sendOrderConfirmationEmail } from '../services/emailService.js';
import { sendAdminWhatsAppNotification } from '../services/whatsappService.js';

// Initialize Razorpay
// Note: Keys will be provided in .env later by the user
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET',
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
export const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
        amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
        currency,
        receipt,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Razorpay Order Creation Error:', error);
        res.status(500);
        throw new Error('Could not create Razorpay order');
    }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId, // our database order ID
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET')
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Payment is genuine
<<<<<<< HEAD
        const orderExists = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (orderExists) {
            const updatedOrder = await prisma.order.update({
                where: { id: orderId },
                data: {
                    paymentStatus: 'paid',
                    razorpayOrderId: razorpay_order_id,
                    razorpayPaymentId: razorpay_payment_id
                },
                include: { user: { select: { id: true, name: true, email: true, phone: true } }, items: true }
            });

            // Compatibility for notification functions
            updatedOrder.user._id = updatedOrder.user.id;
            const backwardsCompatibleOrder = { ...updatedOrder, _id: updatedOrder.id };

            // Notify Customer & Admin after successful payment
            try {
                await sendOrderConfirmationEmail(updatedOrder.user.email, updatedOrder.user.name, backwardsCompatibleOrder);
                await sendAdminWhatsAppNotification(backwardsCompatibleOrder, updatedOrder.user);
                console.log(`Online Order notifications sent for order: ${backwardsCompatibleOrder._id}`);
            } catch (e) {
                console.error('Notification failed for paid order:', backwardsCompatibleOrder._id);
=======
        const order = await Order.findById(orderId).populate('user', 'name email phone');
        if (order) {
            order.paymentStatus = 'paid';
            order.razorpayOrderId = razorpay_order_id;
            order.razorpayPaymentId = razorpay_payment_id;
            await order.save();

            // Notify Customer & Admin after successful payment
            try {
                await sendOrderConfirmationEmail(order.user.email, order.user.name, order);
                await sendAdminWhatsAppNotification(order, order.user);
                console.log(`Online Order notifications sent for order: ${order._id}`);
            } catch (e) {
                console.error('Notification failed for paid order:', order._id);
>>>>>>> efde3d12d5492354106b7066d2592d0917893253
            }

            res.json({ message: 'Payment verified successfully', success: true });
        } else {
            res.status(404);
            throw new Error('Order not found in database');
        }
    } else {
        res.status(400);
        throw new Error('Invalid signature. Payment verification failed.');
    }
});
