import express from 'express';
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  addCartValidator,
  updateCartValidator,
} from '../validators/commerceValidator.js';

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.post('/', addCartValidator, addToCart);
router.put('/:itemId', updateCartValidator, updateCartItem);
router.delete('/:itemId', removeCartItem);

export default router;
