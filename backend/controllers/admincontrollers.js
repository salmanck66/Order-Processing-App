import dotenv from "dotenv";
import sendOTP from "../helpers/adminhelper.js";
import Admin from "../models/admin.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenGen.js";

dotenv.config();

let otpStorage = {}; // Temporary in-memory storage for OTPs

export const requestOTP = async (req, res) => {
  const { phoneNumber } = req.body || "";
  console.log(phoneNumber);

  try {
    if (phoneNumber !== process.env.ADMIN_PHONE_NUMBER) {
      return res.status(401).json({ message: "Phone number not recognized." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStorage[phoneNumber] = otp;

    await sendOTP(otp);

    res.json({ message: "OTP sent to your phone number." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

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
  
      res.cookie('access_token', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  
      res.json({ message: "Login successful." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };


// Logout
export const logout = async (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.json({ message: "Logged out successfully." });
};
export const updateacc = async (req, res) => {
  res.send("Admin update acc");
};
//Main Window Of Orders
export const Dashboard = async (req, res) => {
  res.send("Admin Home");
};
//Resellers View
export const Resellers = async (req, res) => {
  res.send("Admin Resellers");
};
//Products View
export const ProductPageView = async (req, res) => {
  res.send("Admin Product Page");
};
export const addUser = async (req, res) => {
  res.send("Admin user add Page");
};
export const addproduct = async (req, res) => {
  res.send("Admin addproduct");
};

export const deleteproduct = async (req, res) => {
  res.send("Admin addproduct");
};
export const deletereseller = async (req, res) => {
  res.send("Admin deletereseller");
};
export const editproduct = async (req, res) => {
  res.send("Admin edit product");
};
export const xlsreportgen = async (req, res) => {
  res.send("Admin edit product");
};
export const refreshToken = async (req, res) => {
  res.send("Admin edit product");
};
