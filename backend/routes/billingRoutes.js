import express from 'express';
import { createBill, getBills, getBillById, getDailySummary } from '../controllers/billingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.post('/', createBill);
router.get('/summary/today', getDailySummary);
router.get('/', getBills);
router.get('/:id', getBillById);

export default router;
