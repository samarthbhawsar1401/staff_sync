const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      department: user.department,
      avatar: user.avatar
    },
    process.env.JWT_SECRET || 'staffsync_super_secret_jwt_key_2026_modern_hrm',
    { expiresIn: '7d' }
  );
};

const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Login successful.',
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department, designation, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const validRole = ['hr', 'manager', 'employee'].includes(role) ? role : 'employee';

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: validRole,
      department: department || 'General',
      designation: designation || (validRole === 'hr' ? 'HR Specialist' : validRole === 'manager' ? 'Team Lead' : 'Staff Associate'),
      phone: phone || '',
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`
    });

    const token = generateToken(newUser);
    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: sanitizeUser(newUser)
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve profile.' });
  }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { phone, address, emergencyContact, skills, avatar } = req.body;
    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (emergencyContact !== undefined) updateData.emergencyContact = emergencyContact;
    if (skills !== undefined) updateData.skills = skills;
    if (avatar !== undefined) updateData.avatar = avatar;

    const updated = await User.findByIdAndUpdate(req.user.id, updateData);
    res.json({
      message: 'Profile updated successfully.',
      user: sanitizeUser(updated)
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile.' });
  }
};
