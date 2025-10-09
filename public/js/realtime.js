const socket = io();

const $list = document.getElementById('rt-products');
const $form = document.getElementById('create-form');
const $status = document.getElementById('create-status');

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.payload)) return data.payload;
  return [];
}

async function loadProducts() {
  try {
    const res = await fetch('/api/products?limit=8&page=1&sort=live');
    const data = await res.json();
    const products = normalizeList(data);
    renderList(products);
  } catch (e) {
    console.error(e);
  }
}

function renderList(products) {
  $list.innerHTML = '';
  for (const p of products) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="row" style="justify-content:space-between;">
        <a href="/products/${p._id}" style="text-decoration:none; color:inherit">
            ${p.title ?? ''}
            </a>
        <span class="muted">${p.code ?? ''}</span>
      </div>
      <div class="muted">${p.description ?? ''}</div>
      <div class="row" style="justify-content:space-between;margin-top:8px;">
        <span>$ ${p.price ?? ''} · Stock: ${p.stock ?? ''} · ${p.category ?? ''}</span>
        ${p.id ? `<button class="danger" data-action="delete" data-id="${p.id}">Eliminar</button>` : ''}
      </div>
    `;
    $list.appendChild(card);
  }
}

$list?.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action="delete"]');
  if (!btn) return;
  const id = btn.dataset.id;
  if (!id) return;

  try {
    const res = await fetch(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar');
    socket.emit('products:changed');
    loadProducts(); // NEW: refrescar inmediatamente sin depender del server
  } catch (err) {
    console.error(err);
  }
});

$form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  $status.textContent = 'Creando...';
  const fd = new FormData($form);
  const payload = Object.fromEntries(fd.entries());

  // --- casteos mínimos ---
  if (payload.price) payload.price = Number(payload.price);
  if (payload.stock) payload.stock = Number(payload.stock);
  payload.status = fd.get('status') !== null; // NEW: checkbox -> boolean
  if (payload.thumbnails) {                    // NEW: string -> array
    payload.thumbnails = payload.thumbnails
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }

  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(out?.message || out?.error || 'Error al crear');

    $form.reset();
    $status.textContent = '✅ Producto creado';

    socket.emit('products:changed');
    loadProducts(); // NEW: refrescar lista aunque el server no emita nada

    setTimeout(() => ($status.textContent = ''), 1500);
  } catch (err) {
    console.error(err);
    $status.textContent = `❌ ${err.message}`;
  }
});

// Cuando el server avisa, se recargan los productos
socket.on('products:update', loadProducts);

socket.on('products:created', loadProducts);
socket.on('products:changed', loadProducts);

// primera carga
loadProducts();
