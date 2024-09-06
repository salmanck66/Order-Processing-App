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
    console.log("Search Query:", searchQuery);

    // Fetch data from the database, filtering products that contain the search query in their name
    const data = await Product.find({
      name: { $regex: searchQuery, $options: "i" }, // 'i' makes the search case-insensitive
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
  console.log("fasd");
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
  console.log("Processing order sizes:", orderSizes);
  return Object.entries(orderSizes).map(([size, quantity]) => ({
    size: size,
    quantity: quantity,
    sizestock: true, // Set default value or modify based on your needs
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
    export const submitorder = async (req, res) => {
      try {
        console.log('Request files:', req.files);
        console.log('Request body:', req.body);
    
        // Parse the body using qs (or directly if it's already in the correct format)
        const decodedBody = qs.parse(req.body);
    
        
        // Check if the files exist
        const pdfFiles = Object.values(req.files); // Fallback to empty array if files are undefined
    
        // Define the order placement time window
        const currentTime = moment();
        const startTime = moment().set({ hour: 20, minute: 0, second: 0 }); // 8 PM today
        const endTime = moment().add(1, "day").set({ hour: 11, minute: 59, second: 59 }); // 11:59 AM the next day
    
        // Check if the current time is outside the allowed window
        if (!currentTime.isBefore(startTime) || currentTime.isAfter(endTime)) {
          return res.status(403).json({ message: "Orders can only be placed between 8 PM and 12 PM." });
        }
    
        // Find the reseller by phone number
        const { phone } = req.user; // Assuming phone number is stored in req.user
        const reseller = await Reseller.findOne({ phone });
        if (!reseller) {
          return res.status(404).json({ message: "Reseller not found" });
        }
    
        // Define the order date
        const orderDate = moment().startOf("day").toDate();
    
        // Check if there's an existing order for the reseller today
        let existingOrder = await Order.findOne({
          "reseller.id": reseller._id,
          createdAt: { $gte: orderDate },
        });
    
        // Upload PDF to Cloudinary and get the URL
       
    
        // Process the PDFs, upload to Cloudinary, and get their URLs
        const pdfUrls = await Promise.all(
          pdfFiles.map(async (file) => {
            if (!file || !file.data) {
              console.log('File with missing data:', file); // Log files with missing data
              return Promise.reject('no pdf'); // Handle files with missing buffer
            } 
            try {
              const url = await uploadToCloudinary(file.data);
              return url;
            } catch (error) {
              console.error('Error uploading file:', error);
              return "No PDF"; // Handle upload errors
            }
          })
        );
    
    
        
    
        // Prepare the order data
        const orderData = {
          reseller: {
            id: reseller._id,
            name: reseller.name, // Assuming reseller has a 'name' field
          },
          customers: Object.keys(decodedBody).map((key,index) => {
            const customer = decodedBody[key];
            return {
              customerName: customer.customerName,
              orders: customer.orders.map((order) => ({
                productId: order._id,
                orderSizes: Object.keys(order.orderSizes).map(size => ({
                  size,
                  quantity: order.orderSizes[size], // Quantity for each size
                })),
              })),
              label: pdfUrls[index], // Assign a label if needed
            };
          }),
          status: false, // or whatever status you want to initialize with
        };
    
        // Save or update the order
        if (existingOrder) {
          // Update the existing order
          existingOrder.customers = orderData.customers;
          existingOrder.status = orderData.status;
          await existingOrder.save();
        } else {
          // Create a new order
          const newOrder = new Order(orderData);
          await newOrder.save();
        }
    
        res.status(200).json({ message: "Order submitted successfully." });
      } catch (error) {
        console.error("Error submitting order:", error);
        res.status(500).json({ message: "An error occurred while submitting the order." });
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
    console.log(orders);

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
    console.log(orders);

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
    console.log(query);

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
