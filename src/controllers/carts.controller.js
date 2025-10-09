import asyncHandler from '../middlewares/asyncHandler.js';
import * as cartService from '../services/cart.service.js';

export const createCart = asyncHandler(async (_req, res) => {
  const cart = await cartService.createCart();
  res.status(201).json(cart);
});

export const getCartById = asyncHandler(async (req, res) => {
  const cart = await cartService.getCartById(req.params.cid, { populate: true });
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart);
});

export const addProductToCart = asyncHandler(async (req, res) => {
  const cart = await cartService.addProductToCart(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });
  res.json(cart);
});

export const removeProduct = asyncHandler(async (req, res) => {
  const cart = await cartService.removeProductFromCart(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart);
});

/** NUEVOS según consigna */
export const replaceProducts = asyncHandler(async (req, res) => {
  const cart = await cartService.replaceProducts(req.params.cid, req.body?.products || []);
  res.json(cart);
});

export const updateQuantity = asyncHandler(async (req, res) => {
  const cart = await cartService.updateProductQuantity(
    req.params.cid,
    req.params.pid,
    req.body?.quantity
  );
  if (!cart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });
  res.json(cart);
});

export const emptyCart = asyncHandler(async (req, res) => {
  const cart = await cartService.emptyCart(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart);
});
