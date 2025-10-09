import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

export async function createCart() {
  return Cart.create({ products: [] });
}

export async function getCartById(id, { populate = true } = {}) {
  const q = Cart.findById(id);
  if (populate) q.populate('products.product');
  return q.lean();
}

export async function addProductToCart(cid, pid) {
  const [cart, product] = await Promise.all([
    Cart.findById(cid),
    Product.findById(pid).lean()
  ]);
  if (!cart || !product) return null;

  const item = cart.products.find(p => String(p.product) === String(pid));
  if (item) item.quantity += 1;
  else cart.products.push({ product: pid, quantity: 1 });

  await cart.save();
  return getCartById(cid);
}

export async function removeProductFromCart(cid, pid) {
  const cart = await Cart.findById(cid);
  if (!cart) return null;
  cart.products = cart.products.filter(p => String(p.product) !== String(pid));
  await cart.save();
  return getCartById(cid);
}

/** PUT /api/carts/:cid  -> reemplaza todo el arreglo de productos */
export async function replaceProducts(cid, products = []) {
  const cart = await Cart.findById(cid);
  if (!cart) return null;

  // se valida que los productos existan
  const ids = products.map(p => p.product);
  const count = await Product.countDocuments({ _id: { $in: ids } });
  if (count !== ids.length) throw new Error('Uno o más productos no existen');

  cart.products = products.map(p => ({
    product: p.product,
    quantity: Math.max(1, Number(p.quantity) || 1)
  }));

  await cart.save();
  return getCartById(cid);
}

/** PUT /api/carts/:cid/products/:pid -> actualiza SOLO quantity */
export async function updateProductQuantity(cid, pid, quantity) {
  const cart = await Cart.findById(cid);
  if (!cart) return null;

  const item = cart.products.find(p => String(p.product) === String(pid));
  if (!item) return null;

  if (!quantity || isNaN(quantity) || Number(quantity) < 1) {
    quantity = item.quantity + 1;
  }
  item.quantity = Math.max(1, Number(quantity) || 1);
  await cart.save();
  return getCartById(cid);
}

/** DELETE /api/carts/:cid -> vaciar carrito */
export async function emptyCart(cid) {
  const cart = await Cart.findById(cid);
  if (!cart) return null;
  cart.products = [];
  await cart.save();
  return getCartById(cid);
}
