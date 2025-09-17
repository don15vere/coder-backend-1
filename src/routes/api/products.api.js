import { Router } from 'express';
import * as ctrl from '../../controllers/products.controller.js';
const router = Router();

router.get('/', ctrl.list);       // GET /api/products
router.get('/:pid', ctrl.getById);// GET /api/products/:pid
router.post('/', ctrl.create);    // POST /api/products
router.put('/:pid', ctrl.update); // PUT /api/products/:pid
router.delete('/:pid', ctrl.remove); // DELETE /api/products/:pid

export default router;
