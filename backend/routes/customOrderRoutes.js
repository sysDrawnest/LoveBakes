import express from 'express';
import {
    createCustomOrder,
    getMyCustomOrders,
    getAllCustomOrders,
    approveCustomOrder,
} from '../controllers/customOrderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createCustomOrder);
router.get('/mine', protect, getMyCustomOrders);
router.get('/admin', protect, admin, getAllCustomOrders);
router.put('/:id/approve', protect, admin, approveCustomOrder);

export default router;
