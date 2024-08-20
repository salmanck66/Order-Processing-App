import { verifyAccessToken, verifyRefreshToken, generateAccessToken, generateRefreshToken } from "../utils/tokenGen.js";
import Admin from "../models/admin.js"; // Import the Admin model

export const verifyToken = async (req, res, next) => {
  // Extract tokens from cookies
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;
  
  if (!accessToken) {
    return res.status(403).json({ message: "No access token provided." });
  }

  try {
    // Verify the access token
    try {
      const decoded = verifyAccessToken(accessToken);
      req.user = decoded; // Attach decoded user info to req object
      return next(); // Continue to the next middleware or route handler
    } catch (err) {
      if (!refreshToken) {
        throw new Error("No refresh token provided.");
      }

      // Verify the refresh token
      const decodedRefreshToken = verifyRefreshToken(refreshToken);
      
      // Check if refresh token exists in the database
      const admin = await Admin.findOne({ refreshToken: refreshToken });
      if (!admin) {
        return res.status(401).json({ message: "Invalid refresh token." });
      }

      // Generate a new access token
      const newAccessToken = generateAccessToken({ phoneNumber: process.env.ADMIN_PHONE_NUMBER });
      res.cookie('access_token', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      
      req.user = verifyAccessToken(newAccessToken);
      return next(); // Continue to the next middleware or route handler
    }
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
};
