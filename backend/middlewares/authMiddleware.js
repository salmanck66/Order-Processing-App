import { verifyAccessToken } from "../utils/tokenGen.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies
  console.log(req.cookies)

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.phoneNumber = decoded.phoneNumber;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
};
