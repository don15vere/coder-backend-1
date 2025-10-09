import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import exphbs from 'express-handlebars';

// Rutas de vistas
import viewsRouter from './routes/views.routes.js';

// Routas API 
import productsApiRouter from './routes/api/products.api.js';
import cartsApiRouter from './routes/api/carts.api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

// --------- Middlewares base ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '../public')));

// --------- Handlebars ----------
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

// --------- Rutas ----------
app.use('/', viewsRouter);

app.use('/api/products', productsApiRouter);
app.use('/api/carts', cartsApiRouter);

// --------- Socket.IO ----------
io.on('connection', (socket) => {
  // Chat simple
  socket.on('chat:message', (data) => {
    // reenvío a todos
    io.emit('chat:message', data);
  });

  // Realtime products: alguien creó/eliminó -> avisamos a todos para refrescar
  socket.on('products:changed', () => {
    io.emit('products:update');
  });
});

// io accesible desde req.app.get('io')
app.set('io', io);
export default httpServer; 
// export { httpServer, io };
// export default app;
