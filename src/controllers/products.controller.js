import asyncHandler from '../middlewares/asyncHandler.js';
import * as productService from '../services/product.service.js';

export const list = asyncHandler(async (req, res) => {
  const { limit, page, sort, query } = req.query;
  const data = await productService.findAll({ limit, page, sort, query });
  res.json(data);
});

export const getOne = asyncHandler(async (req, res) => {
  const prod = await productService.findById(req.params.pid);
  if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(prod);
});

export const create = asyncHandler(async (req, res) => {
  const prod = await productService.create(req.body);
  res.status(201).json(prod);
});

export const update = asyncHandler(async (req, res) => {
  const prod = await productService.update(req.params.pid, req.body);
  if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(prod);
});

export const remove = asyncHandler(async (req, res) => {
  const prod = await productService.remove(req.params.pid);
  if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json({ status: 'ok' });
});
