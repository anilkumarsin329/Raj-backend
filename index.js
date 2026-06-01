import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport.js';
import connectDB from './config/database.js';

import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import userRoutes from './routes/userRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// CORS — normalize origins; set FRONTEND_URL + ALLOWED_ORIGINS on Render
const normalizeOrigin = (url) => {
  if (!url || typeof url !== 'string') return null;
  try {
    const trimmed = url.trim();
    if (!trimmed) return null;
    return new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`).origin;
  } catch {
    return null;
  }
};

const getAllowedOrigins = () => {
  const fromEnv = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_2,
    process.env.FRONTEND_URL_3,
    ...(process.env.ALLOWED_ORIGINS?.split(',') || []),
  ];

  const origins = new Set(
    fromEnv.map(normalizeOrigin).filter(Boolean)
  );

  if (process.env.NODE_ENV !== 'production') {
    [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
    ].forEach((o) => origins.add(o));
  }

  return [...origins];
};

const allowedOrigins = getAllowedOrigins();

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  const normalized = normalizeOrigin(origin);
  if (!normalized) return false;
  if (allowedOrigins.includes(normalized)) return true;
  // Allow all Vercel deployments (production + preview URLs)
  if (process.env.ALLOW_VERCEL_ORIGINS !== 'false') {
    try {
      const { hostname } = new URL(normalized);
      if (hostname.endsWith('.vercel.app')) return true;
    } catch {
      /* ignore */
    }
  }
  return false;
};

if (process.env.NODE_ENV === 'production') {
  console.log('🌐 CORS allowed origins:', allowedOrigins.length ? allowedOrigins : '(none from env — using .vercel.app only)');
}

app.use(cors({
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS blocked:', origin, '| configured:', allowedOrigins);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 204,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session (required for Passport)
const isProduction = process.env.NODE_ENV === 'production';

app.use(session({
  secret: process.env.JWT_SECRET || 'SECRET123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect DB
connectDB();

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🍽️ Rajkumar Catering Services API', status: 'Running', version: '1.0.0' });
});

// Routes
app.use('/api/auth',       authRoutes);
app.use('/api/bookings',   bookingRoutes);
app.use('/api/payments',   paymentRoutes);
app.use('/api/contact',    contactRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});
