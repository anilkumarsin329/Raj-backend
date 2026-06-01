import Newsletter from '../models/Newsletter.js';
import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
        process.env.EMAIL_PASS === 'your_app_password') {
      console.log('⚠️  Email skipped - credentials not configured');
      return;
    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
  } catch (err) {
    console.log('Email send failed (non-critical):', err.message);
  }
};

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.status === 'active') {
        return res.status(400).json({ success: false, message: 'Email already subscribed' });
      }
      existing.status = 'active';
      existing.subscribedAt = new Date();
      await existing.save();
    } else {
      await Newsletter.create({ email });
    }

    // Send emails non-blocking
    const businessName = process.env.BUSINESS_NAME || 'Rajkumar Catering Services';
    sendEmail(email, `🍽️ Welcome to ${businessName} Newsletter!`, `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#f59e0b;padding:25px;text-align:center;color:white;">
          <h1 style="margin:0;">🍽️ ${businessName}</h1>
        </div>
        <div style="padding:25px;background:#f9fafb;">
          <h2>Welcome! 🎉</h2>
          <p>Thank you for subscribing. You'll receive exclusive offers and updates.</p>
          <div style="background:white;padding:15px;border-left:4px solid #f59e0b;margin:20px 0;">
            <strong>🎁 Welcome Offer:</strong> Get 10% off your first booking! Code: <strong>WELCOME10</strong>
          </div>
          <p style="color:#6b7280;font-size:13px;">${businessName} | Lucknow, India | +91 9918309983</p>
        </div>
      </div>
    `);

    sendEmail(process.env.EMAIL_USER, '🔔 New Newsletter Subscriber', `
      <p><strong>New subscriber:</strong> ${email}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
    `);

    res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter!' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already subscribed' });
    }
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ success: false, message: 'Failed to subscribe' });
  }
};

export const getAllSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const subscribers = await Newsletter.find()
      .sort({ subscribedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await Newsletter.countDocuments();
    res.json({ success: true, data: subscribers, total });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch subscribers' });
  }
};

export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await Newsletter.findOneAndUpdate(
      { email }, { status: 'unsubscribed' }, { new: true }
    );
    if (!subscriber) return res.status(404).json({ success: false, message: 'Email not found' });
    res.json({ success: true, message: 'Successfully unsubscribed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to unsubscribe' });
  }
};
