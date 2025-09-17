import { readJSON, writeJSON } from "../utils/fileDb.js";

const PRODUCTS_PATH = "data/products.json";
const REQUIRED_FIELDS = ["title", "description", "code", "price", "stock", "category"];

async function _getAll() {
  return await readJSON(PRODUCTS_PATH, []);
}
async function _saveAll(list) {
  await writeJSON(PRODUCTS_PATH, list);
}

export async function findAll() {
  return _getAll();
}

export async function findById(id) {
  const all = await _getAll();
  return all.find(p => String(p.id) === String(id)) || null;
}

export async function create(data) {
  for (const f of REQUIRED_FIELDS) {
    if (data[f] === undefined) {
      const err = new Error(`El siguiente campo es obligatorio: ${f}`);
      err.status = 400;
      throw err;
    }
  }

  const all = await _getAll();
  const nextId = (all.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) || 0) + 1;

  const product = {
    id: nextId,
    title: String(data.title),
    description: String(data.description),
    code: String(data.code),
    price: Number(data.price),
    status: data.status === undefined ? true : Boolean(data.status),
    stock: Number(data.stock),
    category: String(data.category),
    thumbnails: Array.isArray(data.thumbnails) ? data.thumbnails.map(String) : []
  };

  all.push(product);
  await _saveAll(all);
  return product;
}

export async function update(id, updates = {}) {
  const all = await _getAll();
  const idx = all.findIndex(p => String(p.id) === String(id));
  if (idx === -1) {
    const err = new Error("Producto no encontrado");
    err.status = 404;
    throw err;
  }

  // evitar tocar id
  // eslint-disable-next-line no-unused-vars
  const { id: _ignore, ...rest } = updates;

  const updated = { ...all[idx], ...rest };
  all[idx] = updated;
  await _saveAll(all);
  return updated;
}

export async function remove(id) {
  const all = await _getAll();
  const idx = all.findIndex(p => String(p.id) === String(id));
  if (idx === -1) {
    const err = new Error("Producto no encontrado");
    err.status = 404;
    throw err;
  }
  const [removed] = all.splice(idx, 1);
  await _saveAll(all);
  return removed;
}

export default { findAll, findById, create, update, remove };
