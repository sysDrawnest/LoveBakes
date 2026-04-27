import express from 'express';
const router = express.Router();
import * as billingController from '../controllers/billingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Publicly seed for testing (optional, could be protected)
router.post('/seed', billingController.seedProducts);

// Protected Billing routes
router.get('/products', protect, admin, billingController.getShopProducts);
router.post('/bills', protect, admin, billingController.createBill);
router.get('/daily-report', protect, admin, billingController.getDailyReport);

export default router;
