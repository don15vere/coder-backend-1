export default function errorHandler(err, _req, res, _next) {
  console.error('❌', err);
  const status = err.status || 500;
  const message = err.message || 'Error interno';
  // Si es API, respondé JSON; si es vista, render:
  if (_req?.originalUrl?.startsWith('/api')) {
    return res.status(status).json({ error: message });
  }
  return res.status(status).render('home', { title: 'Error', message });
}