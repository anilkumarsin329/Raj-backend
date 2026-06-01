import express from 'express';
import { subscribeNewsletter, getAllSubscribers, unsubscribeNewsletter } from '../controllers/newsletterController.js';

const router = express.Router();

// Public routes
router.post('/subscribe', subscribeNewsletter);
router.post('/unsubscribe', unsubscribeNewsletter);

// Admin routes
router.get('/subscribers', getAllSubscribers);

export default router;