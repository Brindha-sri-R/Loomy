import express from 'express';
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  loginValidator,
  profileValidator,
  registerValidator,
} from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, profileValidator, updateProfile);

export default router;
