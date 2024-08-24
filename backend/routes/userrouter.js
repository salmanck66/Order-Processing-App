import { Router } from 'express';
import { loginRecallers ,ProductPageView} from '../controllers/usercontrollers.js';
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = Router();


router.post('/login',loginRecallers)
router.use(verifyToken);
router.get("/products", ProductPageView);



export default router;
