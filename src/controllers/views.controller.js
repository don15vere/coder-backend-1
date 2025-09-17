import asyncHandler from '../middlewares/asyncHandler.js';
import productService from '../services/product.service.js';
import cartService from '../services/cart.service.js';

export const home = (_req, res) => {
  res.render('home', { title: 'Inicio' });
};

export const listProducts = asyncHandler(async (_req, res) => {
  const products = await productService.findAll();
  res.render('products', { title: 'Productos', products });
});

export const productDetail = asyncHandler(async (req, res) => {
  const product = await productService.findById(req.params.pid);
  if (!product) return res.status(404).render('home', { title: 'No encontrado', message: 'Producto no encontrado' });
  res.render('products', { title: product.title, products: [product] });
});

export const cartDetail = asyncHandler(async (req, res) => {
  const cart = await cartService.getById(req.params.cid);
  if (!cart) return res.status(404).render('home', { title: 'No encontrado', message: 'Carrito no encontrado' });
  res.render('cart', { title: `Carrito ${req.params.cid}`, cart });
});
