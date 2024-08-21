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

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenGen.js";

// Temporary in-memory storage for OTPs
let otpStorage = {};

// Request OTP
export const requestOTP = async (req, res) => {
  const { phoneNumber } = req.body || "";
  console.log(phoneNumber);
  try {
    if (phoneNumber !== process.env.ADMIN_PHONE_NUMBER) {
  console.log(process.env.ADMIN_PHONE_NUMBER);

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

// Verify OTP and Login
export const verifyOTPAndLogin = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  

  try {
    if (otpStorage[phoneNumber] !== parseInt(otp, 10)) {
      return res.status(401).json({ message: "Invalid OTP." });
    }

    delete otpStorage[phoneNumber];

    const accessToken = generateAccessToken({ phoneNumber });
    const refreshToken = generateRefreshToken({ phoneNumber });

    // Store the refresh token in the database
    await Admin.findOneAndUpdate(
      {},
      { refreshToken },
      { upsert: true } // Create a new document if none exists
    );

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 1000, // 1000 days in milliseconds
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
  res.send("Admin Home");
};

// Resellers View
export const Resellers = async (req, res) => {
  res.send("Admin Resellers");
};

// Products View
export const ProductPageView = async (req, res) => {
  res.send("Admin Product Page");
};

// Add User
export const addUser = async (req, res) => {
  try {
    const { phone, email, name } = req.body;
    console.log(phone, email, name);

    // Generate a random password
    const password = crypto.randomBytes(8).toString("hex"); // 16-character password

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new reseller
    const newReseller = new Reseller({
      name,
      phone,
      email,
      password: hashedPassword, // Store the hashed password
    });

    await newReseller.save();

    // Set up Nodemailer to send the email
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use any email service provider
      auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL, // Sender address
      to: email, // Recipient's email
      subject: "Your Account Credentials For Reselling With United Sports",
      text: `Your account has been created. Please login with the following credentials: 
             Phone Number: ${phone}
             Password: ${password}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Reseller created and email sent!" });
  } catch (error) {
    res.status(500).json({ message: "Error creating reseller", error });
  }
};

// Add Product
export const addproduct = async (req, res) => {
  try {
    const { name, edition, sizes, price } = req.body;

    // Convert the sizes array into an object with boolean values
    const sizeOptions = ["S", "M", "L", "XL", "XXL"];
    const sizesObject = sizeOptions.reduce((acc, size) => {
      acc[size] = sizes.includes(size);
      return acc;
    }, {});

    // Process image files uploaded via Multer and Cloudinary
    const images = req.files
      ? req.files.map((file) => ({
          url: file.path,
          public_id: file.filename,
        }))
      : [];

    const product = new Product({
      name,
      edition,
      sizes: sizesObject, // Use the constructed sizes object
      price,
      images,
      stock: true, // Default to in-stock
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully.", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product." });
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
      { header: "Product", key: "product", width: 30 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Price", key: "price", width: 15 },
      { header: "Total", key: "total", width: 15 },
    ];

    // Fetch orders data
    const orders = await Order.find({});

    // Add rows
    orders.forEach((order) => {
      worksheet.addRow({
        orderId: order._id,
        reseller: order.resellerName,
        product: order.productName,
        quantity: order.quantity,
        price: order.price,
        total: order.price * order.quantity,
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
