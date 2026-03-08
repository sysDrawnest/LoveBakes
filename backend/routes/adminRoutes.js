import express from 'express';
import { getAnalytics, getAllUsers } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/analytics', protect, admin, getAnalytics);
router.get('/users', protect, admin, getAllUsers);
export default router;
