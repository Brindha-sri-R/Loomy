import { body } from 'express-validator';
import { validateRequest } from './authValidator.js';

export const addCartValidator = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Quantity must be between 1 and 50'),
  validateRequest,
];

export const updateCartValidator = [
  body('quantity')
    .isInt({ min: 1, max: 50 })
    .withMessage('Quantity must be between 1 and 50'),
  validateRequest,
];

export const wishlistValidator = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  validateRequest,
];

export const createOrderValidator = [
  body('items')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  validateRequest,
];
