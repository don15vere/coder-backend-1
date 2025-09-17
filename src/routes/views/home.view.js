import { Router } from 'express';
import * as v from '../../controllers/views.controller.js';
const router = Router();

router.get('/', v.home);

export default router;
