import bcrypt from "bcrypt";
import Reseller from '../models/reseller.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenGen.js';

export const loginRecallers = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Check if phone number and password are provided
    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone number and password are required' });
    }

    // Find the user by phone number
    const user = await Reseller.findOne({ phone });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken({ phone });
    const refreshToken = generateRefreshToken({ phone });

    // Send the response with tokens
    res.status(200).json({ 
      message: 'Login successful', 
      user: {
        phone: user.phone,
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};
