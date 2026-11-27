import { body, validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

export const registerValidator = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  validateRequest,
];

export const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest,
];

export const profileValidator = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters'),
  validateRequest,
];

export const googleAuthValidator = [
  body('credential')
    .trim()
    .notEmpty()
    .withMessage('Google credential token is required'),
  validateRequest,
];
