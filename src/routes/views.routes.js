import { Router } from 'express';
import * as productService from '../services/product.service.js';

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
  console.log("product");
  console.log(product);
  res.render('product/index', { product });
});

router.get('/carts/:cid', (req, res) =>
  res.render('carts/show', { title: 'Carrito', cid: req.params.cid })
);

export default router;
