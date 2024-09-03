// verify-admin
import { verifyAccessToken, verifyRefreshToken, generateAccessToken, generateRefreshToken } from "../utils/tokenGen.js";
import Admin from "../models/admin.js";

export const verifyAdmin = async (req, res) => {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    try {
      // Check if accessToken exists and is valid
      if (accessToken) {
        try {
          // Verify and decode the access token
          const decoded = verifyAccessToken(accessToken);
          // console.log('decoded',decoded);
          return res.status(200).json({ message: 'Admin is authenticated' });
        } catch (err) {
          // If token is invalid or expired, proceed to check the refresh token
          console.log('Access token is invalid or expired:', err.message);
        }
      }
  
      // If accessToken is not valid or present, check refreshToken
      if (refreshToken) {
  
        const decodedRefreshToken = verifyRefreshToken(refreshToken);
        const admin = await Admin.findOne({ refreshTokens: refreshToken });
        if (!admin) {
          return res.status(401).json({ message: 'Invalid Refresh token' });
        }
  
        const phoneNumber = process.env.ADMIN_PHONE_NUMBER;
        // Generate a new access token
        const newAccessToken = generateAccessToken({ phoneNumber });
  
        // Set cookies with new tokens
        res.cookie('access_token', newAccessToken, {
          maxAge: 60 * 1000,
          httpOnly: true,
          sameSite: 'Strict',
        });
  
        return res.status(200).json({
          error: false,
          accessToken: newAccessToken,
          message: 'Admin is authenticated with new access token',
        });
      }
  
      // If both tokens are missing or invalid
      return res.status(401).json({ message: 'Authentication required' });
    } catch (err) {
      console.error('Error verifying Admin:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  