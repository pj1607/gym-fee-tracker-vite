import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token', success: 'no' });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decode.id).select('-password');

    next();

  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.status(401).json({ message: 'Unauthorized: Invalid token', success: 'no' });
  }
};
