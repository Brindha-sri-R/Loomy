import express from 'express';
import {
  getProductById,
  getProducts,
  searchProducts,
} from '../controllers/productController.js';
import {
  createProductReview,
  getProductReviews,
  reviewValidator,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', searchProducts);
router.get('/', getProducts);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', protect, reviewValidator, createProductReview);
router.get('/:id', getProductById);

export default router;
