import { Router } from "express";
import multer from "multer";
import {
  requestOTP,
  verifyOTPAndLogin,
  updateacc,
  logout,
  xlsreportgen,
  editproduct,
  deletereseller,
  deleteproduct,
  addproduct,
  Dashboard,
  Resellers,bulkUploadProducts,
  ProductPageView,
  addUser,
  verifyAdmin,
} from "../controllers/admincontrollers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { storage } from "../config/cloudinaryConfig.js"; // Moved Cloudinary config to a separate file

const router = Router();
const upload = multer({ storage });

// Routes for OTP and login (no token required)
router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTPAndLogin);

router.post('/bulk-upload', upload.single('file'), bulkUploadProducts)
router.get('/verify-admin',verifyAdmin)
// Apply token verification middleware globally for the routes below
router.use(verifyToken);
// Routes that require token verification
router.post("/logout", logout);
router.get("/", Dashboard);
router.get("/resellers", Resellers);
router.get("/products", ProductPageView);

router.get("/ordergen", xlsreportgen);

router.post("/adduser", addUser);
router.post("/addproduct", upload.array("images", 5), addproduct);

router.put("/editproduct/:id", editproduct);
router.put("/updateacc", updateacc);

router.delete("/deleteproduct/:id", deleteproduct);
router.delete("/deletereseller/:id", deletereseller);

export default router;
