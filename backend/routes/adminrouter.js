import { Router } from 'express';
import {updateacc,logout,login,xlsreportgen,editproduct,deletereseller,deleteproduct, addproduct,Dashboard, Resellers,ProductPageView ,addUser} from '../controllers/admincontrollers.js'; // Import named exports

const router = Router();
//get routers
router.get('/', Dashboard);
router.get('/resellers', Resellers);
router.get('/products', ProductPageView);
router.get('/ordergen', xlsreportgen);
//post routers
router.post('/user', addUser);
router.post('/login', login);
router.post('/logout', logout);
router.post('/addprouct', addproduct);
//put router
router.put('/editproduct', editproduct);
router.put('/updateacc', updateacc);
//delete router
router.delete('/deleteprouct', deleteproduct);
router.delete('/deletereseller', deletereseller);
export default router;
