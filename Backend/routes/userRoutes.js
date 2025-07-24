import express from 'express';
import { registerUser, loginUser ,sendOtp,checkOtp,resetPassword,updateProfile,logoutUser,getProfile} from '../controllers/userController.js';
import { verifyToken } from '../auth/auth.js';

const router = express.Router();

router.post('/signup', registerUser);  
router.post('/login', loginUser);
router.post('/send-otp', sendOtp);
router.post('/check-otp', checkOtp);
router.post('/reset-password', resetPassword);
router.post('/logout', logoutUser);

router.put('/profile/update', verifyToken, updateProfile);
router.get('/profile',verifyToken, getProfile);


export default router;
