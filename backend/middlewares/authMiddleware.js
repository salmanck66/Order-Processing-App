import { verifyAccessToken, verifyRefreshToken, generateAccessToken, generateRefreshToken } from "../utils/tokenGen.js";
import Reseller from "../models/reseller.js";

export const verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
   
  // Helper function to handle token renewal
  const handleTokenRenewal = async (phoneNumber) => {
    try {
      // Verify the refresh token
      const decodedRefreshToken = verifyRefreshToken(refreshToken);

      // Find the reseller by refresh token
      const reseller = await Reseller.findOne({ refreshTokens: { $in: [refreshToken] } });
      if (!reseller) {
        return res.status(401).json({ message: "Refresh token not found or invalid." });
      }

      // Generate new access token
      const newAccessToken = generateAccessToken({ phoneNumber });

      res.cookie('accessToken', newAccessToken, { 
        httpOnly: true, 
        maxAge: 1000 * 60 * 15, // 15 minutes
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });

      req.user = verifyAccessToken(newAccessToken);
      return next();
      
    } catch (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }
  };

  if (!accessToken) {
    if (!refreshToken) {
      return res.status(403).json({ message: "No access token or refresh token provided." });
    }

    // If no access token, try to verify and renew using refresh token
    try {
      // Determine phone number from refresh token
      const decodedRefreshToken = verifyRefreshToken(refreshToken);
      await handleTokenRenewal(decodedRefreshToken.phoneNumber);
      
    } catch (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ message: "Unauthorized: Invalid refresh token." });
    }
  } else {
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

        const reseller = await Reseller.findOne({ refreshTokens: { $in: [refreshToken] } });
        if (!reseller) {
          return res.status(401).json({ message: "Refresh token not found or invalid." });
        }

        const newAccessToken = generateAccessToken({ phoneNumber: decodedRefreshToken.phoneNumber });

        res.cookie('accessToken', newAccessToken, { 
          httpOnly: true,
          maxAge: 15 * 60 * 1000,
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
  }
};
