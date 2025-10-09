import { Router } from 'express';
import * as ctrl from '../../controllers/carts.controller.js';

const router = Router();

router.post('/', ctrl.createCart);
router.get('/:cid', ctrl.getCartById);
router.post('/:cid/product/:pid', ctrl.addProductToCart);
router.delete('/:cid/product/:pid', ctrl.removeProduct);

router.put('/:cid', ctrl.replaceProducts);                 // reemplazar arreglo completo
router.put('/:cid/products/:pid', ctrl.updateQuantity);    // actualizar SOLO quantity
router.delete('/:cid', ctrl.emptyCart);                    // vaciar carrito

export default router;
