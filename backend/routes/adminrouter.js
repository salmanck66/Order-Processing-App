import { Router } from "express";
import {statusChange,
  requestOTP, stockoutMake,
  verifyOTPAndLogin,getAllProducts,
  updateacc,
  logout,
  xlsreportgen,
  editproduct,
  deletereseller,
  deleteproduct,
  addproduct,
  Dashboard,
  Resellers,
  bulkUploadProducts,
  ProductPageView,
  addUser,
  orderstoday,
} from "../controllers/admincontrollers.js";
import { verifyAdmin } from "../middlewares/authAdmin.js";



const router = Router();
// Routes for OTP and login (no token required)
router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTPAndLogin);

router.post("/bulk-upload" , bulkUploadProducts);

// Apply token verification middleware globally for the routes below
// Routes that require token verification
router.post("/logout", logout);
router.get("/", Dashboard);
router.get("/verify-admin", verifyAdmin);

router.get("/resellers", Resellers);
router.get("/products", ProductPageView);
router.get("/add", ProductPageView);
router.get("/ordergen", xlsreportgen);  

router.get('/orders',orderstoday)
router.post("/adduser", addUser);
router.post("/statuschange", statusChange);
router.post('/addproducts', addproduct);
router.post('/orderitemstockout', stockoutMake);
router.get('/getallproducts', getAllProducts);

router.put("/editproduct/:id", editproduct);
router.put("/updateacc", updateacc);


router.delete("/deleteproduct/:id", deleteproduct);
router.delete("/deletereseller/:id", deletereseller);

export default router;
