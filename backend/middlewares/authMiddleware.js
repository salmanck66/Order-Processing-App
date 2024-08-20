import { verifyAccessToken } from "../utils/tokenGen.js";

export const verifyToken = (req, res, next) => {
  // Extract token from cookies
  const token = req.cookies.accessToken;
  console.log('Token:', token);

  // Check if token exists
  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  try {
    // Verify the token
    const decoded = verifyAccessToken(token);
    req.user = decoded; // Attach decoded user info to req object
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
};
