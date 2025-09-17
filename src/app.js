import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import routes from './routes/index.js';
import logger from './middlewares/logger.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares para parsear JSON y forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Logger simple
app.use(logger);

// Handlebars
app.engine('hbs', engine({
  extname: '.hbs',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', routes);

// 404 y errores
app.use(notFound);
app.use(errorHandler);

export default app;