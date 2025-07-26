import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// export const verifyToken = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({ message: 'Unauthorized: No token', success: 'no' });
//     }

//     const decode = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = await User.findById(decode.id).select('-password');

//     next();

//   } catch (err) {
//     console.error('Auth Middleware Error:', err);
//     return res.status(401).json({ message: 'Unauthorized: Invalid token', success: 'no' });
//   }
// };


export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Try again, please.', success: 'no' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');
   

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized: Token expired', success: 'no' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized: Invalid token', success: 'no' });
    }

    return res.status(401).json({ message: 'Unauthorized: Invalid token', success: 'no' });
  }
};

