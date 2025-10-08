import asyncHandler from "../middlewares/asyncHandler.js";
import * as productService from "../services/product.service.js";

export const list = asyncHandler(async (_req, res) => {
  res.json(await productService.findAll());
});
export const getById = asyncHandler(async (req, res) => {
  const p = await productService.findById(req.params.pid);
  if (!p) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(p);
});
// Crear un nuevo producto
export const create = asyncHandler(async (req, res) => {
  const product = await productService.create(req.body);

  // Emitir actualización a todos los clientes conectados
  const io = req.app.get("io");
  if (io) io.emit("products:update");

  res.status(201).json(product);
});
// Actualizar un producto existente
export const update = asyncHandler(async (req, res) => {
  const product = await productService.update(req.params.pid, req.body);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  // Emitir actualización a todos los clientes conectados
  const io = req.app.get("io");
  if (io) io.emit("products:update");

  res.json(product);
});
// Eliminar un producto
export const remove = asyncHandler(async (req, res) => {
  const deleted = await productService.remove(req.params.pid);
  if (!deleted) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  // Emitir actualización a todos los clientes conectados
  const io = req.app.get("io");
  if (io) io.emit("products:update");

  res.status(204).end();
});