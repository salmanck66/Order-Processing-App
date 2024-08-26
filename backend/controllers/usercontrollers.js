import bcrypt from "bcrypt";
import Reseller from '../models/reseller.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenGen.js';
import Product from "../models/product.js";
import Order from '../models/order.js';

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

  export const logout = async (req, res) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.json({ message: "Logged out successfully." });
  };

  export const Dashboard = async (req, res) => {
    console.log('fasd');
    res.send("Admin Home");
  };

  export const changePassword = async (req, res) => {
    const { phone, currentPassword, newPassword } = req.body;
  
    try {
      // Find the reseller by phone number
      const reseller = await Reseller.findOne({ phone });
      if (!reseller) {
        return res.status(404).json({ message: 'Reseller not found.' });
      }
  
      // Check if the current password is correct
      const isMatch = await bcrypt.compare(currentPassword, reseller.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect.' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the reseller's password
      reseller.password = hashedPassword;
      await reseller.save();
  
      return res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
      console.error('Error updating password:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };

  export const submitorder =async (req, res) => {
    try {
      const { resellerId, products } = req.body;
  
      // Find the reseller by ID
      const reseller = await Reseller.findById(resellerId);
      if (!reseller) {
        return res.status(404).json({ message: 'Reseller not found' });
      }
  
      // Prepare the products array for the order
      const orderProducts = await Promise.all(
        products.map(async (item) => {
          const product = await Product.findById(item.id);
          if (!product) {
            throw new Error(`Product with ID ${item.id} not found`);
          }
  
          return {
            id: product._id,
            name: product.name,
            image: product.images[0].url, // Assuming you want the first image in the array
            size: item.size,
            sizeQuantity: item.sizeQuantity,
          };
        })
      );
  
      // Create the order
      const order = new Order({
        reseller: {
          id: reseller._id,
          name: reseller.name,
        },
        products: orderProducts,
      });
  
      // Save the order to the database
      await order.save();
  
      res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  