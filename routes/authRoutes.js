import express from 'express';
import passport from '../config/passport.js';
import { signup, login, checkEmail, getMe, googleSuccess, googleFailure } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/check-email', checkEmail);
router.get('/me', verifyToken, getMe);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
  googleSuccess
);
router.get('/google/failure', googleFailure);

export default router;