import bcrypt from "bcrypt";
import Reseller from '../models/reseller.js';

export const loginRecallers = async (req, res) => {
  try {
    const { phone, password } = req.body;
    console.log(phone,password);
    // Check if phone number is provided
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

    res.status(200).json({ 
      message: 'Login successful', 
      user: {
        phone: user.phone,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};
