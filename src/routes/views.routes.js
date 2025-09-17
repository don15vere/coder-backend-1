import { Router } from 'express';

const router = Router();

// Home: render básico; el navegador pedirá productos a /api/products
router.get('/', async (req, res) => {
  res.render('home', {
    title: 'Home',
  });
});

// Realtime Products: alta/baja y lista en vivo
router.get('/realtimeproducts', async (req, res) => {
  res.render('realtimeproducts', {
    title: 'Realtime Products',
  });
});

// Chat global simple
router.get('/chat', (req, res) => {
  res.render('chat', {
    title: 'Chat',
  });
});

export default router;
