import * as cartService from "../services/cart.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCartById = asyncHandler(async (req, res) => {
  const cart = await cartService.getById(req.params.cid);
  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }
  res.json(cart);
});

export const createCart = asyncHandler(async (req, res) => {
  const cart = await cartService.create();
  res.status(201).json(cart);
});

export const addProductToCart = asyncHandler(async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await cartService.addProduct(cid, pid);
  res.json(cart);
});
