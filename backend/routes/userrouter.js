import { Router } from 'express';
import { loginRecallers ,Dashboard,ProductPageView ,logout,changePassword}  from '../controllers/usercontrollers.js';
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = Router();


router.post('/login',loginRecallers)
router.use(verifyToken);
router.post("/logout", logout);
router.get("/products", ProductPageView);
router.get("/", Dashboard);


router.post('/editprofile',changePassword)



export default router;
