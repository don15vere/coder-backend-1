// src/services/cart.service.js
import { readJSON, writeJSON } from "../utils/fileDb.js";
import { findById as findProductById } from "./product.service.js";

const CARTS_PATH = "data/carts.json";

async function _getAll() {
  return await readJSON(CARTS_PATH, []);
}
async function _saveAll(list) {
  await writeJSON(CARTS_PATH, list);
}

function _notFound(msg) {
  const err = new Error(msg);
  err.status = 404;
  return err;
}

export async function create() {
  const all = await _getAll();
  const nextId = (all.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0) || 0) + 1;

  const cart = { id: nextId, products: [] };
  all.push(cart);
  await _saveAll(all);
  return cart;
}

export async function getById(id) {
  const all = await _getAll();
  return all.find(c => String(c.id) === String(id)) || null;
}

export async function addProduct(cid, pid) {
  const all = await _getAll();
  const idx = all.findIndex(c => String(c.id) === String(cid));
  if (idx === -1) throw _notFound("Carrito no encontrado");

  // validar que el producto exista
  const prod = await findProductById(pid);
  if (!prod) throw _notFound("Producto no encontrado");

  const cart = all[idx];
  const item = cart.products.find(p => String(p.product) === String(pid));
  if (item) {
    item.quantity += 1;
  } else {
    cart.products.push({ product: prod.id, quantity: 1 });
  }

  all[idx] = cart;
  await _saveAll(all);
  return cart;
}

// (Opcional) útil si más adelante lo necesitás desde la vista en tiempo real:
export async function removeProduct(cid, pid) {
  const all = await _getAll();
  const idx = all.findIndex(c => String(c.id) === String(cid));
  if (idx === -1) throw _notFound("Carrito no encontrado");

  const cart = all[idx];
  const pidx = cart.products.findIndex(p => String(p.product) === String(pid));
  if (pidx === -1) throw _notFound("Producto en carrito no encontrado");

  // si querés decrementar de a uno:
  if (cart.products[pidx].quantity > 1) {
    cart.products[pidx].quantity -= 1;
  } else {
    cart.products.splice(pidx, 1);
  }

  all[idx] = cart;
  await _saveAll(all);
  return cart;
}

export default { create, getById, addProduct, removeProduct };
