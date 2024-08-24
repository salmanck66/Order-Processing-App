import bcrypt from "bcrypt";
import Reseller from '../models/reseller.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenGen.js';
import Product from "../models/product.js";

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

    // Save the refresh token in the database
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Set the access token in a cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true, // Helps prevent XSS
      secure: true, // Ensures cookie is sent over HTTPS
      sameSite: 'Strict', // Prevents CSRF
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    // Set the refresh token in a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Helps prevent XSS
      secure: true, // Ensures cookie is sent over HTTPS
      sameSite: 'Strict', // Prevents CSRF
      maxAge: 1000 * 24 * 60 * 60 * 1000 // 1000 days
    });

    // Send the response
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

export const sendOrder =  async (req, res) => {
    
}
// export const sendOrder =  async (req, res) => {

// }
export const ProductPageView = async (req, res) => {
    try {
      const searchQuery = req.query.q;
      console.log("Search Query:", searchQuery);
  
      // Fetch data from the database, filtering products that contain the search query in their name
      const data = await Product.find({
        name: { $regex: searchQuery, $options: 'i' } // 'i' makes the search case-insensitive
      });
  
      // Send the response with the filtered products
      res.status(200).json({ products: data });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products" });
    }
  };