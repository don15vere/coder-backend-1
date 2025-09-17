import app from './src/app.js';
import config from './src/config/index.js';

app.listen(config.port, () =>
  console.log(`Servidor en http://localhost:${config.port} (${config.env})`)
);
