import { Router } from 'express';
import {savingLabel,checkUser,productsSearch,eachOrder,prevOrdersOut,fetchProfile, submitorder,loginResellers ,Dashboard,ProductPageView ,logout,changePassword, getOrdersByDate}  from '../controllers/usercontrollers.js';
import { verifyToken } from "../middlewares/authMiddleware.js";
import { badgeslist } from '../controllers/admincontrollers.js';
const router = Router();


router.post('/login',loginResellers)
router.use(verifyToken);
router.post("/logout", logout);
router.get("/products", ProductPageView);
router.get("", ProductPageView);
router.get("/",Dashboard);
router.post('/submitorder',  submitorder);
router.post('/editprofile',changePassword)
router.get('/recent-orders',prevOrdersOut)
router.get('/eachorder/:orderId',eachOrder)
router.get('/fetchProfile',fetchProfile)
router.post('/productsearch',productsSearch)
router.post('/label-save',savingLabel)
router.get('/checkuser',checkUser)
router.get('/CustomersByDate',getOrdersByDate)
router.get('/CustomersByDate',getOrdersByDate)
router.get("/badgesList", badgeslist);



export default router;
