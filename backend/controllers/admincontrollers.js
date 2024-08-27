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

import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/tokenGen.js";

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
  console.log('fasd');
  res.send("Admin Home");
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


// Add User
export const addUser = async (req, res) => {
  try {
    const { phone, email, name } = req.body;
    console.log(phone, email, name);

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
    const { name, edition, sizes, price } = req.body;

    // Convert the sizes array into an object with boolean values
    const sizeOptions = ["S", "M", "L", "XL", "XXL"];
    const sizesObject = sizeOptions.reduce((acc, size) => {
      acc[size] = sizes.includes(size);
      return acc;
    }, {});

    // Process image files uploaded via Multer and Cloudinary
    const images = req.files
      ? await Promise.all(
          req.files.map(async (file) => {
            const result = await cloudinary.v2.uploader.upload(file.path, {
              transformation: [
                { width: 500, crop: "scale" },
                { quality: 35 },
                { fetch_format: "auto" },
              ],
            });

            return {
              url: result.secure_url,
              public_id: result.public_id,
            };
          })
        )
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
