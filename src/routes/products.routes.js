import { Router } from "express";
import { ProductManager } from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (_req, res) => {
  const items = await productManager.getAll();
  res.json(items);
});

router.get("/:pid", async (req, res) => {
  const prod = await productManager.getById(req.params.pid);
  if (!prod) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(prod);
});

router.post("/", async (req, res) => {
  try {
    const created = await productManager.create(req.body || {});
    res.status(201).json(created);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updated = await productManager.update(req.params.pid, req.body || {});
    res.json(updated);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const removed = await productManager.delete(req.params.pid);
    res.json({ deleted: removed });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;