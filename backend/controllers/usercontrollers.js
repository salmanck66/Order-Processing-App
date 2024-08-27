import bcrypt from "bcrypt";
import Reseller from '../models/reseller.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenGen.js';
import Product from "../models/product.js";
import Order from '../models/order.js';
import moment from 'moment';

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

  // Function to create and save an order
  export const submitorder = async (req, res) => {
    try {
      const products = req.body;
      const { phone } = req.user;
  
      // Check if the current time is between 8 PM and 12 PM
      const currentTime = moment();
      const startTime = moment().set({ hour: 20, minute: 0 });
      const endTime = moment().set({ hour: 23, minute: 59 });
  
      if (!currentTime.isBetween(startTime, endTime)) {
        return res.status(403).json({ message: 'Orders can only be placed between 8 PM and 12 PM' });
      }
  
      // Find the reseller by phone
      const reseller = await Reseller.findOne({ phone });
      if (!reseller) {
        return res.status(404).json({ message: 'Reseller not found' });
      }
  
      // Prepare the products array for the order
      const orderProducts = await Promise.all(
        products.map(async (item) => {
          const product = await Product.findById(item.productId);
          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }
  
          // Extract the selected sizes and quantities
          const selectedSizes = Object.keys(item.orderSizes).reduce((acc, size) => {
            if (item.orderSizes[size].quantity > 0) {
              acc.push({
                size: size,
                quantity: item.orderSizes[size].quantity,
              });
            }
            return acc;
          }, []);
  
          return {
            id: product._id,
            sizes: selectedSizes,
          };
        })
      );
  
      // Check if there is an existing order within the time frame
      const existingOrder = await Order.findOne({
        'reseller.id': reseller._id,
        createdAt: { $gte: startTime.toDate(), $lt: endTime.toDate() },
      });
  
      if (existingOrder) {
        // Concatenate the new products with the existing order
        existingOrder.products = existingOrder.products.concat(orderProducts);
        await existingOrder.save();
  
        res.status(200).json({ message: 'Order updated successfully', order: existingOrder });
      } else {
        // Create a new order
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
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  