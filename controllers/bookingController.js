import Booking from '../models/Booking.js';

export const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    if (!bookingData.fullName || !bookingData.phoneNumber || !bookingData.emailAddress ||
        !bookingData.eventType || !bookingData.eventDate || !bookingData.guestCount ||
        !bookingData.eventTime || !bookingData.eventDuration || !bookingData.budgetRange) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    if (bookingData.guestCount < 25) {
      return res.status(400).json({ message: 'Minimum guest count is 25' });
    }

    if (!bookingData.mealType || bookingData.mealType.length === 0) {
      return res.status(400).json({ message: 'At least one meal type must be selected' });
    }

    const booking = await Booking.create(bookingData);
    res.status(201).json({ message: 'Booking submitted successfully!', bookingId: booking._id, booking });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const filter = status ? { status } : {};
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await Booking.countDocuments(filter);
    res.json({ bookings, total });
  } catch (err) {
    console.error('Get bookings error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    console.error('Get my bookings error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ booking });
  } catch (err) {
    console.error('Get booking error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    console.error('Update booking error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
