import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token failed or expired' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};

export const checkBanStatus = async (req, res, next) => {
  const user = req.user;
  if (user?.ban?.isBanned && new Date() < new Date(user.ban.bannedUntil)) {
    return res.status(403).json({
      message: `You are banned until ${new Date(user.ban.bannedUntil).toLocaleString()}`,
    });
  }
  next();
};