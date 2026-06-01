import express from 'express';
import { createPayment, getPaymentsByBooking, getAllPayments } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/', createPayment);
router.get('/', getAllPayments);
router.get('/:bookingId', getPaymentsByBooking);

export default router;