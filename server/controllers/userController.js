import { generateToken } from '../utils/jwt.js';
import cloudinary from '../config/cloudinary.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { signupSchema, loginSchema } from '../schemas/userSchema.js';

export const signup = async (req, res) => {
  try {
    const validatedData = signupSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        message: validatedData.error.errors[0].message
      });
    }

    const { fullName, email, password, bio } = validatedData.data;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
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

    generateToken(newUser._id, res);
    
    res.status(201).json({
      success: true,
      userData: newUser,
      message: 'Account Created Successfully '
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const validatedData = loginSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        message: validatedData.error.errors[0].message
      });
    }

    const { email, password } = validatedData.data;
    
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Credentials'
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Credentials'
      });
    }

    generateToken(userData._id, res);

    res.status(200).json({
      success: true,
      userData,
      message: 'Login Successful'
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const checkAuth = (req, res) => {
  res.status(200).json({ success: true, user: req.user });
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

    res.status(200).json({ success: true, user: updatedUser, message: 'Profile updated successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};