import { Router } from 'express';
import {prevOrdersOut, submitorder,loginResellers ,Dashboard,ProductPageView ,logout,changePassword}  from '../controllers/usercontrollers.js';
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = Router();


router.post('/login',loginResellers)
router.use(verifyToken);
router.post("/logout", logout);
router.get("/products", ProductPageView);
router.get("/", Dashboard);

router.post('/submitorder',submitorder)
router.post('/editprofile',changePassword)
router.get('/recent-orders', prevOrdersOut);



export default router;
