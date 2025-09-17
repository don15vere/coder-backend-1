import { Router } from 'express';
import home from './home.view.js';
import products from './products.view.js';
import carts from './carts.view.js';

const router = Router();
router.use(home);
router.use(products);
router.use(carts);

export default router;
