import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "SECRET123", {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Signup successful!",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email!" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid password!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "SECRET123", {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful!",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (err) {
    console.error('Email check error:', err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Google OAuth Success
export const googleSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET || "SECRET123", {
      expiresIn: "7d",
    });

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}&name=${encodeURIComponent(req.user.name)}`);
  } catch (err) {
    console.error('Google success error:', err);
    res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
  }
};

// Google OAuth Failure
export const googleFailure = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
};