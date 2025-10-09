import { Router } from 'express';
import * as productService from '../services/product.service.js';
import Cart from '../models/cart.model.js';

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

router.get('/products', (_req, res) => res.render('products/index', { title: 'Productos' }));

router.get('/products/:pid', async (req, res) => {
  const { pid } = req.params;
  const product = await productService.findById(pid);
  res.render('product/index', { product });
});

router.get('/carts/:cid', (req, res) =>
  res.render('carts/show', { title: 'Carrito', cid: req.params.cid })
);

router.get('/carts', async (req, res) => {
  try {
    const carts = await Cart.find().lean(); // lean() para usar con Handlebars
    const cartsData = carts.map(c => ({
      id: c._id,
      count: c.products?.length || 0
    }));
    res.render('carts', { carts: cartsData });
  } catch (err) {
    console.error('[views] error al listar carritos', err);
    res.status(500).send('Error al cargar carritos');
  }
});

export default router;
