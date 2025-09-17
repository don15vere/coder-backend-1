import { Router } from 'express';
import * as v from '../../controllers/views.controller.js';
const router = Router();

router.get('/products', v.listProducts);           // listado
router.get('/products/:pid', v.productDetail);     // detalle

export default router;
