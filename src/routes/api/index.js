import { Router } from 'express';
import products from './products.api.js';
import carts from './carts.api.js';
const router = Router();

router.use('/products', products);
router.use('/carts', carts);

export default router;
