import { readJSON, writeJSON } from "../utils/fileDb.js";
import { ProductManager } from "./product.service.js";

const CARTS_PATH = "data/carts.json";
const productManager = new ProductManager();

export class CartManager {
  async getAll() {
    return await readJSON(CARTS_PATH, []);
  }

  async getById(id) {
    const all = await this.getAll();
    return all.find(c => String(c.id) === String(id)) || null;
  }

  async create() {
    const all = await this.getAll();
    const nextId = (all.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0) || 0) + 1;

    const cart = { id: nextId, products: [] };
    all.push(cart);
    await writeJSON(CARTS_PATH, all);
    return cart;
  }

  async addProduct(cid, pid) {
    const all = await this.getAll();
    const idx = all.findIndex(c => String(c.id) === String(cid));
    if (idx === -1) {
      const err = new Error("Carrito no encontrado");
      err.status = 404;
      throw err;
    }

    // Validar que el producto exista
    const prod = await productManager.getById(pid);
    if (!prod) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      throw err;
    }

    const cart = all[idx];
    const item = cart.products.find(p => String(p.product) === String(pid));
    if (item) {
      item.quantity += 1;
    } else {
      cart.products.push({ product: prod.id, quantity: 1 });
    }

    all[idx] = cart;
    await writeJSON(CARTS_PATH, all);
    return cart;
  }
}
