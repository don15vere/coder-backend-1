import { Router } from 'express';
import api from './api/index.js';
import views from './views/index.js';

const router = Router();

router.use('/', views);
router.use('/api', api);

export default router;
