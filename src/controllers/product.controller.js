import asyncHandler from '../middlewares/asyncHandler.js';
import productService from '../services/product.service.js';
export const list = asyncHandler(async (_req, res) => {
  const items = await productService.findAll();
  res.json(items);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await productService.findById(req.params.pid);
  if (!item) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(item);
});

export const create = asyncHandler(async (req, res) => {
  const created = await productService.create(req.body);
  res.status(201).json(created);
});

export const update = asyncHandler(async (req, res) => {
  const updated = await productService.update(req.params.pid, req.body);
  res.json(updated);
});

export const remove = asyncHandler(async (req, res) => {
  await productService.remove(req.params.pid);
  res.status(204).end();
});
