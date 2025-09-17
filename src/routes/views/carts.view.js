import { Router } from 'express';
import * as v from '../../controllers/views.controller.js';
const router = Router();

router.get('/carts/:cid', v.cartDetail);

export default router;
