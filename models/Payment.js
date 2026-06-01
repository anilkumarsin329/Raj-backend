import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  bookingId:     { type: String, required: true },
  userId:        { type: String },
  amount:        { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentType:   { type: String, default: 'advance' },
  transactionId: { type: String, required: true, unique: true },
  paymentStatus: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
  status:        { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
  cardLast4:     { type: String },
  cardType:      { type: String },
  upiId:         { type: String },
  completedAt:   { type: Date },
  createdAt:     { type: Date, default: Date.now }
});

export default mongoose.model('Payment', paymentSchema);
