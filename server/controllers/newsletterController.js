import { body } from 'express-validator';
import Newsletter from '../models/Newsletter.js';
import { validateRequest } from '../validators/authValidator.js';

export const newsletterValidator = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  validateRequest,
];

export async function subscribeNewsletter(req, res, next) {
  try {
    const email = req.body.email.toLowerCase().trim();
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(200).json({
        alreadySubscribed: true,
        message: 'You are already subscribed to LOOMY drops.',
      });
    }

    await Newsletter.create({ email });
    return res.status(201).json({
      alreadySubscribed: false,
      message: 'Subscribed to LOOMY drops.',
    });
  } catch (err) {
    next(err);
  }
}
