import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  resetPasswordToken:{
        type: String,
  },
  resetPasswordExpires:{
        type: Date,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;

