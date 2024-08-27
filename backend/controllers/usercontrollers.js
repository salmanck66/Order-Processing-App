import bcrypt from "bcrypt";
import Reseller from '../models/reseller.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenGen.js';
import Product from "../models/product.js";
import Order from '../models/order.js';
import moment from 'moment';

export const loginResellers = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Check if phone number and password are provided
    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone number and password are required' });
    }

    // Find the reseller by phone number
    const reseller = await Reseller.findOne({ phone });

    // Check if the reseller exists
    if (!reseller) {
      return res.status(404).json({ message: 'Reseller not found' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, reseller.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken({ phone });
    const refreshToken = generateRefreshToken({ phone });

    // Save the refresh token in the database
    reseller.refreshTokens.push(refreshToken);
    await reseller.save();

    // Set the access token in a cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true, // Helps prevent XSS
      secure: process.env.NODE_ENV === 'production', // Ensures cookie is sent over HTTPS
      sameSite: 'Strict', // Prevents CSRF
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    // Set the refresh token in a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Helps prevent XSS
      secure: process.env.NODE_ENV === 'production', // Ensures cookie is sent over HTTPS
      sameSite: 'Strict', // Prevents CSRF
      maxAge: 1000 * 24 * 60 * 60 * 1000 // 1000 days
    });

    // Send the response
    res.status(200).json({ 
      message: 'Login successful', 
      user: {
        phone: reseller.phone,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

export const sendOrder =  async (req, res) => {
    
}

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
  
      // Define the order placement time window
      const currentTime = moment();
      const startTime = moment().set({ hour: 20, minute: 0, second: 0 }); // 8 PM today
      const endTime = moment().add(1, 'day').set({ hour: 11, minute: 59, second: 59 }); // 11:59 AM the next day
  
      // Check if the current time is within the allowed window
      if (!currentTime.isBetween(startTime, endTime)) {
        return res.status(403).json({ message: 'Orders can only be placed between 8 PM and 12 PM.' });
      }
  
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
  
      // Determine the order's effective date (next day if placed between 8 PM and 11:59 AM)
      const orderDate = currentTime.isBetween(startTime, endTime) ? moment().add(1, 'day').startOf('day').toDate() : moment().startOf('day').toDate();
  
      // Check if there is an existing order for the effective date
      const existingOrder = await Order.findOne({
        'reseller.id': reseller._id,
        createdAt: { $gte: orderDate },
      });
  
      if (existingOrder) {
        // Update the existing order
        existingOrder.products = existingOrder.products.concat(orderProducts);
        await existingOrder.save();
  
        return res.status(200).json({ message: 'Order updated successfully', order: existingOrder });
      } else {
        // Create a new order for the effective date
        const order = new Order({
          reseller: {
            id: reseller._id,
            name: reseller.name,
          },
          products: orderProducts,
          createdAt: orderDate, // Set the order's creation date to the effective date
        });
  
        await order.save();
  
        return res.status(201).json({ message: 'Order placed successfully', order });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  
  
  
  export const prevOrdersOut = async (req, res) => {
    try {
      const { phone } = req.user;
      const recaller = await   Reseller.findOne({phone})
       // Assuming you have the reseller ID in req.user from the middleware
      const recentOrders = await Order.find({ 'reseller.id': recaller._id })
        .sort({ createdAt: -1 })
  
      const formattedOrders = recentOrders.map(order => ({
        id:order._id,
        date: order.createdAt.toISOString().split('T')[0], // Format the date as YYYY-MM-DD
        productCount: order.products.length,
      }));
      res.status(200).json({ orders: formattedOrders });
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      res.status(500).json({ message: 'Server error. Could not fetch recent orders.' });
    }
  };


  export const eachOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
  

      // Find orders for the reseller and populate product details
      const orders = await Order.findById(orderId)
        .populate('products.id')  // Populate product details using the 'id' reference
        .sort({ createdAt: -1 });
      console.log(orders);
      

      res.status(200).json({ orders });
    } catch (error) {
      console.error('Error fetching each order:', error);
      res.status(500).json({ message: 'Server error. Could not fetch each order.' });
    }
  };
  
  