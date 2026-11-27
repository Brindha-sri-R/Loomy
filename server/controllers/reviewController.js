import { body } from 'express-validator';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { validateRequest } from '../validators/authValidator.js';

export const reviewValidator = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 3, max: 600 })
    .withMessage('Review comment must be between 3 and 600 characters'),
  validateRequest,
];

async function findProductByParam(id) {
  const query = mongoose.Types.ObjectId.isValid(id)
    ? { _id: id }
    : { slug: id };
  return Product.findOne(query);
}

export async function getProductReviews(req, res, next) {
  try {
    const product = await findProductByParam(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const reviews = await Review.find({ product: product._id }).sort({
      createdAt: -1,
    });
    return res.json({ reviews });
  } catch (err) {
    next(err);
  }
}

export async function createProductReview(req, res, next) {
  try {
    const product = await findProductByParam(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existing = await Review.findOne({
      product: product._id,
      user: req.user._id,
    });
    if (existing) {
      return res.status(409).json({
        message: 'You have already reviewed this product.',
      });
    }

    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment.trim(),
    });

    const stats = await Review.aggregate([
      { $match: { product: product._id } },
      {
        $group: {
          _id: '$product',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      product.rating = Number(stats[0].avgRating.toFixed(1));
      product.reviews = stats[0].count;
      await product.save();
    }

    return res.status(201).json({
      review,
      rating: product.rating,
      reviewsCount: product.reviews,
    });
  } catch (err) {
    next(err);
  }
}
