import Product from '../models/product.model.js';

/**
 * GET /api/products
 * Soporta: ?limit=10&page=1&sort=asc|desc&query=<categoria|disponible|no disponible>
 * - sort: por price
 * - query: si es disponible/no disponible => stock; si no => category exacta
 */
export async function findAll({ limit = 10, page = 1, sort, query } = {}) {
  const lim = Math.max(1, Number(limit) || 10);
  const pg  = Math.max(1, Number(page) || 1);

  const filter = {};
  if (query) {
    const q = String(query).toLowerCase();
    if (q === 'disponible' || q === 'true' || q === '1') filter.stock = { $gt: 0 };
    else if (q === 'no disponible' || q === 'false' || q === '0') filter.stock =  { $lte: 0 };
    else filter.category = query; // categoría exacta
  }

  const sortObj = {};
  if (sort && ['asc','desc'].includes(String(sort).toLowerCase())) {
    sortObj.price = sort.toLowerCase() === 'asc' ? 1 : -1;
  } else if (sort && sort == 'live') {
    sortObj.createdAt = -1; // los más nuevos primero
  }


  const [totalDocs, docs] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter).sort(sortObj).skip((pg - 1) * lim).limit(lim).lean()
  ]);

  const totalPages = Math.max(1, Math.ceil(totalDocs / lim));

  const status = totalDocs <= 0 ? 'error' : 'success';
  return {
    status: status,
    payload: docs,
    totalDocs,
    totalPages,
    page: pg,
    limit: lim,
    hasPrevPage: pg > 1,
    hasNextPage: pg < totalPages,
    prevPage: pg > 1 ? pg - 1 : null,
    nextPage: pg < totalPages ? pg + 1 : null
  };
}

export async function findById(id) { return Product.findById(id).lean(); }
export async function create(data)  { return Product.create(data); }
export async function update(id, data) {
  return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true, lean: true });
}
export async function remove(id) { return Product.findByIdAndDelete(id).lean(); }
