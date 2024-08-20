import { Router } from 'express';
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
  Resellers,
  ProductPageView,
  addUser
} from '../controllers/admincontrollers.js'; 

import { verifyToken } from '../middlewares/authMiddleware.js'; 

const router = Router();

// Routes for OTP and login (no token required)
router.post('/request-otp', requestOTP); // Step 1: Request OTP
router.post('/verify-otp', verifyOTPAndLogin); // Step 2: Verify OTP and login

// Apply token verification middleware globally for the routes below
router.use(verifyToken);

// Routes that require token verification
router.post('/logout', logout);
router.get('/', Dashboard);
router.get('/resellers', Resellers);
router.get('/products', ProductPageView);
router.get('/ordergen', xlsreportgen);

router.post('/user', addUser);
router.post('/addproduct', addproduct);

router.put('/editproduct', editproduct);
router.put('/updateacc', updateacc);

router.delete('/deleteproduct', deleteproduct);
router.delete('/deletereseller', deletereseller);

export default router;
