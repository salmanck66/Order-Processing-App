import Admin from "../models/admin.js";
import sendOTP from "../helpers/adminhelper.js";
import Product from "../models/product.js";
import ExcelJS from "exceljs";
import Reseller from "../models/reseller.js";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Order from "../models/order.js";
import moment from 'moment';
import Badge from "../models/badge.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/tokenGen.js";
import {  uploadToCloudinary } from "../config/cloudinaryConfig.js";
import { monthlyStatus } from "../helpers/monthleyStatus.js";
import { status } from "../helpers/dashBoardStatus.js";

// Temporary in-memory storage for OTPs
let otpStorage = {};

// Request OTP
export const requestOTP = async (req, res) => {
  const { phoneNumber } = req.body || "";
  console.log(phoneNumber);

  try {
    if (phoneNumber !== process.env.ADMIN_PHONE_NUMBER) {
  console.log('as',process.env.ADMIN_PHONE_NUMBER);

      return res.status(401).json({ message: "Phone number not recognized." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStorage[phoneNumber] = otp;
    console.log(otp)

    await sendOTP(otp);

    res.json({ message: "OTP sent to your phone number." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const bulkUploadProducts = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../uploads/", req.file.filename);
    const products = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // Assuming row contains your product details
        products.push({
          name: row.name,
          edition: row.edition,
          sizes: row.sizes.split(","), // Assuming sizes are comma-separated
          // Add other necessary fields
        });
      })
      .on("end", async () => {
        await Product.insertMany(products);
        res.status(200).json({ message: "Bulk upload successful!" });
      });
  } catch (error) {
    res.status(500).json({ message: "Bulk upload failed!", error });
  }
};



export const verifyOTPAndLogin = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    // Validate OTP
    if (otpStorage[phoneNumber] !== parseInt(otp, 10)) {
      return res.status(401).json({ message: "Invalid OTP." });
    }

    // OTP validated, remove it from storage
    delete otpStorage[phoneNumber];

    // Generate tokens
    const accessToken = generateAccessToken({ phoneNumber });
    const refreshToken = generateRefreshToken({ phoneNumber, userType: 'admin' });

    // Update or create admin document (assuming only one admin exists)
    await Admin.findOneAndUpdate(
      {}, // No need for a filter if there's only one admin
      { $push: { refreshTokens: refreshToken } },
      { upsert: true, new: true }
    );

    // Set cookies
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'Strict',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'Strict',
      maxAge: 1000 * 60 * 60 * 24 * 1000,
    });

    res.json({ message: "Login successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// Logout
export const logout = async (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.json({ message: "Logged out successfully." });
};

// Dashboard View
export const Dashboard = async (req, res) => {
  const graphData = await monthlyStatus()
  const statusData = await status()
    
  res.status(200).json({graphData, statusData})
};

// Resellers View
export const Resellers = async (req, res) => {
  const resellers =await Reseller.find()
  res.json({resellers})
};

// Products View
export const ProductPageView = async (req, res) => {
  try {
    const searchQuery = req.query.q;

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


// Add User
export const addUser = async (req, res) => {
  try {
    const { phone, email, name } = req.body;

    // Generate a random password
    const password = crypto.randomBytes(8).toString("hex");

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new reseller
    const newReseller = new Reseller({ name, phone, email, password: hashedPassword });
    await newReseller.save();

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your Account Credentials For Reselling With United Sports",
      text: `Your account has been created. Please login with the following credentials: \nPhone Number: ${phone}\nPassword: ${password}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Reseller created and email sent!" });
  } catch (error) {
    res.status(500).json({ message: "Error creating reseller", error });
  }
};




// Add Product

export const addproduct = async (req, res) => {
  try {
    

    // Extract products data from req.body
    const products = [];
    Object.keys(req.body).forEach(key => {
      const match = key.match(/^products\[(\d+)]\[(\w+)]$/);
      if (match) {
        const [_, index, field] = match;
        if (!products[index]) products[index] = {};
        products[index][field] = req.body[key];
      }
    });

    // Process each product
    const createdProducts = await Promise.all(
      products.map(async (productData, index) => {
        const { name, edition, sizes, price } = productData;

        // Convert the sizes array into an object with boolean values
        const sizeOptions = ["S", "M", "L", "XL", "XXL"];
        const sizesObject = sizeOptions.reduce((acc, size) => {
          acc[size] = sizes?.includes(size);
          return acc;
        }, {});

        // Process image files
        const images = [];
        for (let i = 0; i < 3; i++) {
          const fileKey = `products[${index}][images][${i}]`;
          if (req.files[fileKey]) {
            images.push(req.files[fileKey].data); // Add file data to images array
          }
        }

        // Handle image file processing
        const imageDetails = await Promise.all(
          images.map(async (fileBuffer) => {
            try {
              const url = await uploadToCloudinary(fileBuffer);
              return {
                url,
                public_id: url.split('/').pop().split('.')[0], // Extract the public_id from the URL
              };
            } catch (error) {
              console.error('Error uploading file to Cloudinary:', error);
              return null; // Skip this image if there's an error
            }
          })
        );

        // Filter out any null image entries
        const validImageDetails = imageDetails.filter(image => image !== null);

        // Create and save the product
        const product = new Product({
          name,
          edition,
          sizes: sizesObject,
          price,
          images: validImageDetails,
          stock: true, // Default to in-stock
        });

        return await product.save();
      })
    );

    res.status(201).json({ message: "Products added successfully.", products: createdProducts });
  } catch (error) {
    console.error("Error adding products:", error);
    res.status(500).json({ message: "Failed to add products.", error: error.message });
  }
};




// Edit Product
// Edit Product
export const editproduct = async (req, res) => {
  const { id } = req.params;
  const { name, edition, sizes, price } = req.body;

  try {
    // Convert sizes array into an object with boolean values
    const sizeOptions = ["S", "M", "L", "XL", "XXL"];
    const sizesObject = sizeOptions.reduce((acc, size) => {
      acc[size] = sizes.includes(size);
      return acc;
    }, {});

    const updatedData = {
      name,
      edition,
      sizes: sizesObject,
      price,
    };

    // If files are uploaded, process them
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
      updatedData.images = images;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product." });
  }
};

// Delete Product
// Delete Product
export const deleteproduct = async (req, res) => {
  const { id } = req.params;
console.log(id);

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product." });
  }
};


export const deleteMultipleProducts = async (req, res) => {
  const  ids = req.body.ids;
console.log(ids);

  try {
    const deletedResult = await Product.deleteMany({_id: {$in:ids}});

    if (deletedResult.deletedCount === 0) {
      return res.status(404).json({ message: "No products found to delete" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product." });
  }
};
// Delete Reseller
// Delete Reseller
export const deletereseller = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReseller = await Reseller.findByIdAndDelete(id);

    if (!deletedReseller) {
      return res.status(404).json({ message: "Reseller not found" });
    }

    res.status(200).json({ message: "Reseller deleted successfully" });
  } catch (error) {
    console.error("Error deleting reseller:", error);
    res.status(500).json({ message: "Failed to delete reseller." });
  }
};

// Generate XLS Report

export const xlsreportgen = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders Report");

    // Add columns
    worksheet.columns = [
      { header: "Order ID", key: "orderId", width: 20 },
      { header: "Reseller", key: "reseller", width: 20 },
      { header: "Customer", key: "customerName", width: 20 },
      { header: "Product", key: "product", width: 30 },
      { header: "Size", key: "size", width: 10 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Price", key: "price", width: 15 },
      { header: "Total", key: "total", width: 15 },
    ];

    // Fetch orders data
    const orders = await Order.find({})
      .populate("customers.orders.productId") // Populate product details
      .exec();

    // Add rows
    orders.forEach((order) => {
      order.customers.forEach((customer) => {
        customer.orders.forEach((productOrder) => {
          productOrder.orderSizes.forEach((sizeDetail) => {
            const product = productOrder.productId;
            const totalPrice = product.price * sizeDetail.quantity;

            worksheet.addRow({
              orderId: order._id,
              reseller: order.reseller.name,
              customerName: customer.customerName,
              product: product.name,
              size: sizeDetail.size,
              quantity: sizeDetail.quantity,
              price: product.price,
              total: totalPrice,
            });
          });
        });
      });
    });

    // Write to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="orders_report.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Error generating XLS report:", error);
    res.status(500).json({ message: "Failed to generate XLS report." });
  }
};

// Update Account
// Update Account
export const updateacc = async (req, res) => {
  const { phoneNumber, email, name } = req.body;

  try {
    const updatedAdmin = await Admin.findOneAndUpdate(
      { phoneNumber: process.env.ADMIN_PHONE_NUMBER },
      { email, name },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res
      .status(200)
      .json({ message: "Account updated successfully", admin: updatedAdmin });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({ message: "Failed to update account." });
  }
};


export const orderstoday = async (req, res) => {
  try {
    // Get today's start and end of the day
    const startOfToday = moment().startOf('day').toDate();
    const endOfToday = moment().endOf('day').toDate();

    // Find orders created today and not completed
    const ordersNotCompleted = await Order.findOne({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
      status: false,
    })
    .populate('customers.orders.productId', 'name') // Populate product name
    .exec();

    // Get the total count of orders created today
    const totalOrdersToday = await Order.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    // Calculate pending orders
    const orderspending = totalOrdersToday - ordersNotCompleted?.length;

    return res.status(200).json({
      ordersNotCompleted,
      orderspending,
      totalOrdersToday,
    });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ error: error.message });
  }
};

export const resellerCompleteOrder = async(req, res) => {
    const  { orderId} = req.body 
    console.log(req.body);
    
    try {
      const order = await Order.findById(orderId)
      if(!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const checkAllCustomerOrders = order.customers.every(cust => cust.status === true)
      if (!checkAllCustomerOrders) {
        return res.status(400).json({ message: "Not all customers have completed their orders"})
      }
      order.status = true
      await order.save()
     
      
      
      return res.status(200).json({
        status,
        message: "Order completed successfully",
      })
    } catch(error) {
      console.log(error)
      return res.status(500).json({ error: error.message })
    }
}


export const statusChange = async (req, res) => {
  try {
    const { orderId, id } = req.body;
    console.log(req.body);
    
    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Find the customer index within the order's customers array
    const customerIndex = order.customers.findIndex(cust => cust._id.toString() === id);

    if (customerIndex === -1) {
      return res.status(404).json({ message: 'Customer not found in the order' });
    }

    // Update the status of the specified customer
    order.customers[customerIndex].status = true;
    const status = order.customers.every((cust) => cust.status === true)
      console.log('status',status);
    // Save the updated order document
    const updatedOrder = await order.save();

    return res.status(200).json({ message: 'Customer status updated successfully',status, updatedOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const stockoutMake = async (req, res) => {
  const { productid, customerid, size, checked } = req.body;
  const phone = req.user.phone;

  try {
    // Find the reseller by phone number
    const reseller = await Reseller.findOne({ phone });
    if (!reseller) {
      return res.status(404).json({ message: 'Reseller not found' });
    }

    // Find today's date, ignoring time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the current date's order for this reseller
    const order = await Order.findOne({
      'reseller.id': reseller._id,
      createdAt: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // until end of the day
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Find the customer and the product within the order
    const customer = order.customers.id(customerid);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const productOrder = customer.orders.find(
      (order) => order.productId.toString() === productid
    );
    if (!productOrder) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the size within the product order
    const sizeToUpdate = productOrder.orderSizes.find(
      (orderSize) => orderSize.size === size
    );
    if (!sizeToUpdate) {
      return res.status(404).json({ message: 'Size not found' });
    }

    // Update the sizestock field if checked is true
    if (checked) {
      sizeToUpdate.sizestock = false;
      await order.save();
      return res.status(200).json({ message: 'Size marked as out of stock' });
    }

    return res.status(400).json({ message: 'Invalid operation' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { search } = req.query;

    // If a search query is provided, filter products by name containing the search string
    let products;
    if (search) {
      products = await Product.find({ name: { $regex: search, $options: 'i' } }); // Case-insensitive search
    } else {
      products = await Product.find();
    }

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

export const ProductStockOut = async (req, res) => {
  const { fullstockout, sizes, productID } = req.body;

  if (!productID) {
    return res.status(400).json({ message: "Product ID is required." });
  }

  try {
    const product = await Product.findById(productID);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (fullstockout === false) {
      // Mark all sizes as out of stock
      product.sizes = {
        S: false,
        M: false,
        L: false,
        XL: false,
        XXL: false,
      };
      product.stock = false; // Full stockout
    } else if (fullstockout === true) {
      if (sizes&&Object.keys(sizes).length>0) {
        // Update sizes based on provided sizes
        const updatedSizes = { ...product.sizes };
        for (const size in sizes) {
          if (sizes.hasOwnProperty(size) && updatedSizes.hasOwnProperty(size)) {
            updatedSizes[size] = sizes[size]; // Set true or false based on the sizes provided
          }
        }
        product.sizes = updatedSizes;
      } else {
        // If no specific sizes are provided, make all sizes true (in stock)
        product.sizes = {
          S: true,
          M: true,
          L: true,
          XL: true,
          XXL: true,
        };
      }
      product.stock = true; // Mark product as in stock
    }

    await product.save();

    return res.status(200).json({ message: "Product stock updated successfully.", product });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred.", error });
  }
};



export const toggleOrderStatus = async (req, res) => {
  try {
    const { orderId, customerId, orderIndex } = req.params; // Parameters expected from the request

    // Validate parameters
    if (!orderId || !customerId || orderIndex === undefined) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Convert orderIndex to integer
    const index = parseInt(orderIndex, 10);
    if (isNaN(index)) {
      return res.status(400).json({ message: 'Invalid order index' });
    }

    // Find the order by ID
    const order = await Order.findOne({ _id: orderId, 'customers._id': customerId });
    if (!order) {
      return res.status(404).json({ message: 'Order or customer not found' });
    }

    // Locate the customer
    const customer = order.customers.id(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found in the order' });
    }

    // Locate the specific order within the customer's orders
    const orderItem = customer.orders[index];
    if (!orderItem) {
      return res.status(404).json({ message: 'Order item not found' });
    }

    // Toggle the status
    orderItem.status = !orderItem.status;

    // Save the updated order
    await order.save();

    res.status(200).json({ message: 'Order status toggled successfully', order });
  } catch (error) {
    console.error('Error toggling order status:', error);
    res.status(500).json({ message: 'An error occurred while toggling the order status' });
  }
};

export const addBadge = async (req, res) => {
  try {
    const { name, price } = req.body;
    const imageFile = req.file;  // Single file from multer

    // Check if the required fields are provided
    if (!name || !price || !imageFile) {
      return res.status(400).json({ message: "Please provide all required fields (name, price, and image)" });
    }

    // Upload the image to Cloudinary
    const uploadResult = await uploadToCloudinary(imageFile);

    // Create a new badge with the uploaded image data
    const newBadge = new Badge({
      name,
      price,
      images: [
        {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        },
      ],
    });

    // Save the badge to the database
    await newBadge.save();

    // Respond with success and the created badge
    res.status(201).json({
      message: "Badge created successfully",
      badge: newBadge,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating badge",
      error: error.message,
    });
  }
};
