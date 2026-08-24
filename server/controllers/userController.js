import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({
        success: false,
        message: 'Missing Details'
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.json({
        success: false,
        message: 'Account Already exists '
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio
    });

    const token = generateToken(newUser._id);
    res.json({
      success: true,
      userData: newUser,
      token,
      message: 'Account Created Successfully '
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.json({
        success: false,
        message: 'Invalid Credentials'
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.json({
        success: false,
        message: 'Invalid Credentials'
      });
    }

    const token = generateToken(userData._id);
    res.json({
      success: true,
      userData,
      token,
      message: 'Login Successful'
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio;

    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = upload.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

    res.json({ success: true, user: updatedUser, message: 'Profile updated successfully' });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};