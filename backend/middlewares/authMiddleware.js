import { verifyAccessToken, verifyRefreshToken, generateAccessToken, generateRefreshToken } from "../utils/tokenGen.js";
import Admin from "../models/admin.js";

export const verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;
  
  if (!accessToken) {
    if (!refreshToken) {
      return res.status(403).json({ message: "No access token or refresh token provided." });
    }

    try {
      // Verify the refresh token
      const decodedRefreshToken = verifyRefreshToken(refreshToken);

      // Check if the refresh token exists in the database
      const admin = await Admin.findOne({ refreshToken });
      if (!admin) {
        return res.status(401).json({ message: "Refresh token not found or invalid." });
      }

      // Generate a new access token
      const newAccessToken = generateAccessToken({ phoneNumber: process.env.ADMIN_PHONE_NUMBER });

      res.cookie('access_token', newAccessToken, { 
        httpOnly: true, 
        maxAge: 1000 * 60 * 15,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict' // Add SameSite attribute for additional security
      });

      req.user = verifyAccessToken(newAccessToken);
      return next();
      
    } catch (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }
  }

  try {
    // Verify the access token
    const decoded = verifyAccessToken(accessToken);
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name !== "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid access token." });
    }

    // Access token is expired, but refresh token was not checked yet
    if (!refreshToken) {
      return res.status(403).json({ message: "No refresh token provided." });
    }

    // Verify the refresh token and handle accordingly
    try {
      const decodedRefreshToken = verifyRefreshToken(refreshToken);
      const admin = await Admin.findOne({ refreshToken });
      if (!admin) {
        return res.status(401).json({ message: "Refresh token not found or invalid." });
      }

      const newAccessToken = generateAccessToken({ phoneNumber: process.env.ADMIN_PHONE_NUMBER });

      res.cookie('access_token', newAccessToken, { 
        httpOnly: true,
        maxAge: 15 * 60 * 15,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });

      req.user = verifyAccessToken(newAccessToken);
      return next();
      
    } catch (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ message: "Unauthorized: Invalid refresh token." });
    }
  }
};
