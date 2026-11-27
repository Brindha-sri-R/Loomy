import express from 'express';
import {
  newsletterValidator,
  subscribeNewsletter,
} from '../controllers/newsletterController.js';

const router = express.Router();

router.post('/', newsletterValidator, subscribeNewsletter);

export default router;
