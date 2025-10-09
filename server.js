// import 'dotenv/config';
// import app from './src/app.js';
// import { connectDB } from './src/config/db.js';

// const PORT = process.env.PORT || 8080;

// (async () => {
//   try {
//     await connectDB(process.env.MONGO_URL);   // ⬅️ esperamos a Mongo
//     app.listen(PORT, () => console.log(`HTTP listo en http://localhost:${PORT}`));
//   } catch (err) {
//     console.error('[mongo] fallo al conectar:', err?.message);
//     process.exit(1);
//   }
// })();

import 'dotenv/config';
import httpServer from './src/app.js';     // ⬅️ cambia: importás httpServer
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    httpServer.listen(PORT, () =>        // ⬅️ escuchás el httpServer
      console.log(`HTTP listo en http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('[mongo] fallo al conectar:', err?.message);
    process.exit(1);
  }
})();
