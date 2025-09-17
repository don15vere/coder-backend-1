import asyncHandler from "../utils/asyncHandler.js";
import * as productService from "../services/product.service.js";

export const list = asyncHandler(async (_req, res) => {
  res.json(await productService.findAll());
});
export const getById = asyncHandler(async (req, res) => {
  const p = await productService.findById(req.params.pid);
  if (!p) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(p);
});
export const create = asyncHandler(async (req, res) => {
  res.status(201).json(await productService.create(req.body));
});
export const update = asyncHandler(async (req, res) => {
  res.json(await productService.update(req.params.pid, req.body));
});
export const remove = asyncHandler(async (req, res) => {
  await productService.remove(req.params.pid);
  res.status(204).end();
});