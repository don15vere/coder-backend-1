import { Router } from "express";
import { CartManager } from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

// POST / -> crear carrito
router.post("/", async (_req, res) => {
  const cart = await cartManager.create();
  res.status(201).json(cart);
});

// GET /:cid -> listar productos del carrito
router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getById(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart.products);
});

// POST /:cid/product/:pid -> agregar/incrementar producto
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await cartManager.addProduct(req.params.cid, req.params.pid);
    res.status(201).json(cart);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;