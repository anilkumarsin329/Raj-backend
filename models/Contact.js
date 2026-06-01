import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  subject: { type: String, required: true, enum: ['wedding', 'corporate', 'birthday', 'quote', 'general'] },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['new', 'read', 'replied', 'closed'], default: 'new' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  adminNotes: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Contact", contactSchema);