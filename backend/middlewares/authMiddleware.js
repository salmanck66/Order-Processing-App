import { verifyAccessToken, verifyRefreshToken, generateAccessToken, generateRefreshToken } from "../utils/tokenGen.js";
import Admin from "../models/admin.js";

export const verifyToken = async (req, res, next) => {
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
      if (err.name !== "TokenExpiredError") {
        return res.status(401).json({ message: "Invalid access token." });
      }

      // If access token is expired, check refresh token
      if (!refreshToken) {
        return res.status(403).json({ message: "No refresh token provided." });
      }

      // Verify the refresh token
      const decodedRefreshToken = verifyRefreshToken(refreshToken);
      
      // Check if refresh token exists in the database
      const admin = await Admin.findOne({ refreshToken });
      if (!admin) {
        return res.status(401).json({ message: "Refresh token not found or invalid." });
      }

      // Generate a new access token and refresh token
      const newAccessToken = generateAccessToken({ phoneNumber: process.env.ADMIN_PHONE_NUMBER });
      const newRefreshToken = generateRefreshToken({ phoneNumber: process.env.ADMIN_PHONE_NUMBER });
      
      admin.refreshToken = newRefreshToken;
      await admin.save();

      res.cookie('access_token', newAccessToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production' 
      });
      res.cookie('refresh_token', newRefreshToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 1000 * 60 * 60 * 24 * 1000 // 1000 days in milliseconds
      });

      req.user = verifyAccessToken(newAccessToken);
      return next(); // Continue to the next middleware or route handler
    }
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
};
