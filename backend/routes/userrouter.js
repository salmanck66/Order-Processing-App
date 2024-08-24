import { Router } from 'express';
import { loginRecallers } from '../controllers/usercontrollers.js';

const router = Router();

router.post('/login',loginRecallers)



export default router;
