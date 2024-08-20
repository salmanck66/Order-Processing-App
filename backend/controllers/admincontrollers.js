import dotenv from "dotenv";
import sendOTP from "../helpers/adminhelper.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenGen.js";

dotenv.config();

let otpStorage = {}; // Temporary in-memory storage for OTPs

// Step 1: Verify phone number and send OTP
export const requestOTP = async (req, res) => {
  const { phoneNumber } = req.body || "";
  console.log(phoneNumber)

  try {
    // Compare the input phone number with the one stored in the .env file
    if (phoneNumber !== process.env.ADMIN_PHONE_NUMBER) {
      return res
        .status(401)
        .json({ message: "Phone number not recognized." });
    }

    // Generate and store OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    otpStorage[phoneNumber] = otp; // Store OTP temporarily

    // Send OTP to the phone number
    await sendOTP(otp);

    res.json({ message: "OTP sent to your phone number." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Step 2: Verify OTP and generate tokens
export const verifyOTPAndLogin = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    // Check if phone number and OTP match
    if (otpStorage[phoneNumber] !== parseInt(otp, 10)) {
      return res.status(401).json({ message: "Invalid OTP." });
    }

    delete otpStorage[phoneNumber];

    // Generate the access and refresh tokens
    const accessToken = generateAccessToken({ phoneNumber });
    const refreshToken = generateRefreshToken({ phoneNumber });

    // Set tokens in cookies
    res.cookie('access_token', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // Send a success response
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
