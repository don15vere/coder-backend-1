export default function notFound(req, res, _next) {
  res.status(404).render('home', { title: '404', message: 'Recurso no encontrado' });
}