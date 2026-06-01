import express from 'express';
import { createBooking, getAllBookings, getMyBookings, getBookingById, updateBookingStatus } from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/my-bookings', verifyToken, getMyBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBookingStatus);

export default router;
