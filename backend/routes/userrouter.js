import { Router } from 'express';
import {productsSearch,eachOrder,prevOrdersOut,fetchProfile, submitorder,loginResellers ,Dashboard,ProductPageView ,logout,changePassword}  from '../controllers/usercontrollers.js';
import { verifyToken } from "../middlewares/authMiddleware.js";
import { upload } from '../config/cloudinaryConfig.js'; // Update with correct path
const router = Router();


router.post('/login',loginResellers)
router.use(verifyToken);
router.post("/logout", logout);
router.get("/products", ProductPageView);
router.get("", ProductPageView);
router.get("/",Dashboard);
router.post('/submitorder', upload.single('pdf'), submitorder);
router.post('/editprofile',changePassword)
router.get('/recent-orders',prevOrdersOut)
router.get('/eachorder/:orderId',eachOrder)
router.get('/fetchProfile/',fetchProfile)
router.post('/productsearch/',productsSearch)




export default router;
