import { httpServer } from './src/app.js';
import config from './src/config/index.js';

httpServer.listen(config.port, () =>
  console.log(`Servidor en http://localhost:${config.port} (${config.env})`)
);