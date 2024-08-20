import { verifyAccessToken } from "../utils/tokenGen.js";

export const verifyToken = (req, res, next) => {
  const accessToken = req.cookies.access_token;
  console.log('Access Token:', accessToken);

  if (!accessToken) {
    return res.status(403).json({ message: "No token provided." });
  }

  try {
    const decoded = verifyAccessToken(accessToken);
    req.user = decoded; // Attach decoded user info to req object
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
};
