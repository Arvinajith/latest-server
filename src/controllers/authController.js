import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/token.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'attendee',
  });

  const token = generateToken(user);
  res.status(201).json({ token, user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.json({ token, user });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = ['name', 'bio', 'avatarUrl', 'preferences'].reduce((acc, field) => {
    if (typeof req.body[field] !== 'undefined') acc[field] = req.body[field];
    return acc;
  }, {});

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json({ user });
});

