import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  alternateContact: { type: String },
  eventType: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventTime: { type: String, required: true },
  eventDuration: { type: String, required: true },
  guestCount: { type: Number, required: true, min: 25 },
  budgetRange: { type: String, required: true },
  venueAddress: { type: String },
  venueType: { type: String },
  kitchenFacilities: { type: String },
  mealType: [{ type: String }],
  cuisine: [{ type: String }],
  additionalServices: [{ type: String }],
  dietary: [{ type: String }],
  specialRequirements: { type: String },
  referralSource: { type: String },
  contactMethod: { type: String, default: "phone" },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", bookingSchema);