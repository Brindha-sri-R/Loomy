import express from 'express';
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrders,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { createOrderValidator } from '../validators/commerceValidator.js';

const router = express.Router();

router.use(protect);
router.post('/', createOrderValidator, createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);

export default router;
