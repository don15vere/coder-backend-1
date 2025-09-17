import { Router } from 'express';
import * as ctrl from '../../controllers/carts.controller.js';
const router = Router();

router.post('/', ctrl.createCart);
router.get('/:cid', ctrl.getCart);
router.post('/:cid/product/:pid', ctrl.addProduct);
router.delete('/:cid/product/:pid', ctrl.removeProduct);

export default router;
