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
    const res = await fetch('/api/products');
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
        <strong>${p.title ?? ''}</strong>
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
    // Se avisa por socket que cambiaron los productos
    socket.emit('products:changed');
  } catch (err) {
    console.error(err);
  }
});

$form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  $status.textContent = 'Creando...';
  const fd = new FormData($form);
  const payload = Object.fromEntries(fd.entries());
  // casteos mínimos
  if (payload.price) payload.price = Number(payload.price);
  if (payload.stock) payload.stock = Number(payload.stock);

  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || 'Error al crear');
    }
    $form.reset();
    $status.textContent = '✅ Producto creado';
    // Se avisa por socket que cambiaron los productos
    socket.emit('products:changed');
    setTimeout(() => ($status.textContent = ''), 1500);
  } catch (err) {
    console.error(err);
    $status.textContent = `❌ ${err.message}`;
  }
});

// Cuando el server avisa, se recargan los productos
socket.on('products:update', loadProducts);

// primera carga
loadProducts();
