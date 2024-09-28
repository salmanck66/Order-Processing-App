import bcrypt from "bcrypt";
import Reseller from "../models/reseller.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenGen.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import moment from "moment";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
import { uploadToCloudinary } from "../config/cloudinaryConfig.js";
import qs from 'qs'


export const loginResellers = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Check if phone number and password are provided
    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: "Phone number and password are required" });
    }

    // Find the reseller by phone number
    const reseller = await Reseller.findOne({ phone });

    // Check if the reseller exists
    if (!reseller) {
      return res.status(404).json({ message: "Reseller not found" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, reseller.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken({ phone });
    const refreshToken = generateRefreshToken({ phone });

    // Save the refresh token in the database
    reseller.refreshTokens.push(refreshToken);
    await reseller.save();

    // Set the access token in a cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Helps prevent XSS
      secure: process.env.NODE_ENV === "production", // Ensures cookie is sent over HTTPS
      sameSite: "Strict", // Prevents CSRF
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set the refresh token in a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Helps prevent XSS
      secure: process.env.NODE_ENV === "production", // Ensures cookie is sent over HTTPS
      sameSite: "Strict", // Prevents CSRF
      maxAge: 1000 * 24 * 60 * 60 * 1000, // 1000 days
    });

    // Send the response
    res.status(200).json({
      message: "Login successful",
      user: {
        phone: reseller.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const sendOrder = async (req, res) => {};

export const ProductPageView = async (req, res) => {
  try {
    const searchQuery = req.query.q;
    // Fetch data from the database, filtering products that contain the search query in their name
    const data = await Product.find({
      name: { $regex: searchQuery, $options: "i" },stock:true // 'i' makes the search case-insensitive
    });

    // Send the response with the filtered products
    res.status(200).json({ products: data });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully." });
};

export const Dashboard = async (req, res) => {
  res.send("Admin Home");
};

export const changePassword = async (req, res) => {
  const { phone, currentPassword, newPassword } = req.body;

  try {
    // Find the reseller by phone number
    const reseller = await Reseller.findOne({ phone });
    if (!reseller) {
      return res.status(404).json({ message: "Reseller not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, reseller.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the reseller's password
    reseller.password = hashedPassword;
    await reseller.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Function to create and save an order

const processOrderSizes = (orderSizes) => {
  return Object.entries(orderSizes).map(([size, quantity]) => ({
    size: size,
    quantity: quantity,
    sizestock: true,
  }));
};

const parseOrderData = (flatData) => {
  const orders = {};

  Object.keys(flatData).forEach(key => {
    const match = key.match(/^orders\]\[(\d+)\]\[(.*?)\]$/);
    if (match) {
      const [, index, field] = match;
      if (!orders[index]) orders[index] = {};
      orders[index][field] = flatData[key];
    }
  });

  return Object.values(orders).map(order => ({
    ...order,
    orderSizes: Object.keys(order.orderSizes || {}).map(size => ({
      size,
      quantity: order.orderSizes[size]
    }))
  }));
};
export const submitOrder = async (req, res) => {
  try {
    // Parse the body, assuming it's in JSON format
    const customers = req.body;
    console.log(JSON.stringify(customers, null, 2)); // Pretty print with indentation

    // Define the order placement time window
    const currentTime = moment();
    const startTime = moment().set({ hour: 20, minute: 0, second: 0 }); // 8 PM today
    const endTime = moment().add(1, 'day').set({ hour: 11, minute: 59, second: 59 }); // 11:59 AM the next day

    // Check if the current time is outside the allowed window
    if (!currentTime.isBefore(startTime) || currentTime.isAfter(endTime)) {
      return res.status(403).json({ message: 'Orders can only be placed between 8 PM and 12 PM.' });
    }

    // Find the reseller by phone number from req.user (assuming authentication middleware)
    const { phone } = req.user;
    const reseller = await Reseller.findOne({ phone });
    if (!reseller) {
      return res.status(404).json({ message: 'Reseller not found' });
    }

    // Define the order date for checking if a previous order exists today
    const orderDate = moment().startOf('day').toDate();

    // Check if there's an existing order for the reseller today
    let existingOrder = await Order.findOne({
      'reseller.id': reseller._id,
      createdAt: { $gte: orderDate },
    });

    // Prepare the new customers data from the request body
    const newCustomers = customers.map((customer) => ({
      customerName: customer.customerName || 'Unknown',
      orders: customer.orders.map((order) => ({
        productId: order._id, // Assuming you want to store the product ID
        orderSizes: Object.keys(order.orderSizes).map(size => ({
          size,
          quantity: order.orderSizes[size],
          sizestock: order.sizes[size] || true, // Include stock if available
        })),
        customizations: order.customizations || [], // Ensure customizations are included
        badges: order.badges?.map(badge => ({
          size: badge.size,
         
          badges: badge.badges,
        })) || [], // Default to an empty array if no badges are provided
        status: order.status ?? false, // Default status
      })),
      label: customer.label || 'No PDF URL', // Use the provided label URL or fallback
      status: customer.status ?? false, // Default status
    }));

    // Save or update the order in the database
    if (existingOrder) {
      // Update the existing order with new customers
      existingOrder.customers.push(...newCustomers);
      await existingOrder.save();
    } else {
      // Create a new order if no existing order found for today
      const newOrder = new Order({
        reseller: {
          id: reseller._id,
          name: reseller.name,
        },
        customers: newCustomers,
        status: false, // Default status
      });
      await newOrder.save();
    }

    // Return a success response
    res.status(200).json({ message: 'Order submitted successfully.' });
  } catch (error) {
    console.error('Error submitting order:', error);
    res.status(500).json({ message: 'An error occurred while submitting the order.' });
  }
};




export const prevOrdersOut = async (req, res) => {
  try {
    const { phone } = req.user;
    const recaller = await Reseller.findOne({ phone });
    // Assuming you have the reseller ID in req.user from the middleware
    const recentOrders = await Order.find({ "reseller.id": recaller._id }).sort(
      { createdAt: -1 }
    );

    const formattedOrders = recentOrders.map((order) => ({
      id: order._id,
      date: order.createdAt.toISOString().split("T")[0], // Format the date as YYYY-MM-DD
      productCount: order.products.length,
    }));
    res.status(200).json({ orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch recent orders." });
  }
};

export const eachOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find orders for the reseller and populate product details
    const orders = await Order.findById(orderId)
      .populate("products.id") // Populate product details using the 'id' reference
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching each order:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch each order." });
  }
};

export const fetchProfile = async (req, res) => {
  try {
    const { phone } = req.user;

    const reseller = await Reseller.findOne({ phone }).select(
      "-password -refreshTokens"
    );
    if (!reseller) {
      return res.status(404).json({ message: "Reseller not found" });
    }

    const orders = await Order.find({ "reseller.id": reseller._id }).exec();
    const customers = orders[0].customers;

    return res.status(200).json({
      reseller,
      customers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const productsSearch = async (req, res) => {
  try {
    const { editions, sizes, inStock, searchQuery } = req.body;

    // Build the query object
    let query = {};

    // Add search functionality if search term is provided (search by name only)
    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: "i" }; // Case-insensitive search on name
    }

    // Filter by editions if provided
    if (editions && editions.length > 0) {
      query.edition = { $in: editions };
    }

    // Filter by sizes if provided
    if (sizes && sizes.length > 0) {
      query[`sizes.${sizes[0]}`] = true;
    }

    // Filter by stock status if provided
    if (typeof inStock == true) {
      query.stock = inStock;
    }

    // Fetch products based on the query
    const products = await Product.find(query);

    // Respond with the filtered products
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const checkUser = async (req, res) => {
  res.status(200).json({ status: "success" });
};

export const getOrdersByDate = async (req, res) => {
  const { phone } = req.user; 
  
  try {
    const resellers = await Reseller.findOne({ phone });
    
    if (!resellers) {
      return res.status(404).json({ message: "Reseller not found" });
    }

    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const selectedDate = new Date(date);

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0); 

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      'reseller.id': resellers._id,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
    .populate('reseller.id') // Populate reseller details if needed

    // Send back the orders data
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders by date for reseller:', error);
    res.status(500).json({ message: 'Failed to fetch orders by date for reseller' });
  }
};

export const badgeslist = async (req, res) => {
  try {

    const data = await Badge.find() || "No Badges"

    res.status(200).json({ badge: data });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const savingLabel = async (req, res) => {
  try {
    console.log(req.files);
    
    // Check if files are uploaded
    if (!req.files ) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.files.file; // Since multer stores the files in an array, take the first one

    const result = await uploadToCloudinary(file.data);
    console.log(result);
    
    // Check if upload is successful
    if (result ) {
      res.status(201).json({ url: result });
    } else {
      res.status(404).json({ message: "File upload failed" });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};