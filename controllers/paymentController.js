import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';

export const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod, cardLast4, cardType, upiId } = req.body;

    if (!bookingId || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'bookingId, amount and paymentMethod are required' });
    }

    const transactionId = `GF${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const payment = await Payment.create({
      bookingId: bookingId.toString(),
      amount: Number(amount),
      paymentMethod,
      transactionId,
      paymentStatus: 'completed',
      status: 'completed',
      completedAt: new Date(),
      ...(cardLast4 && { cardLast4 }),
      ...(cardType && { cardType }),
      ...(upiId && { upiId }),
    });

    // Update booking status - non-blocking
    Booking.findByIdAndUpdate(bookingId, { status: 'confirmed' }).catch(e =>
      console.log('Booking update failed:', e.message)
    );

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully!',
      transactionId: payment.transactionId,
      paymentStatus: payment.paymentStatus,
      amount: payment.amount,
    });
  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ success: false, message: 'Payment processing failed' });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await Payment.countDocuments();
    res.json({ success: true, payments, total });
  } catch (err) {
    console.error('Get payments error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getPaymentsByBooking = async (req, res) => {
  try {
    const payments = await Payment.find({ bookingId: req.params.bookingId });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
