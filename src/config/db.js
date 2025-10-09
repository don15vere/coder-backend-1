import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) throw new Error('MONGO_URL no definido');
  // Opcional: hace que los errores salgan al toque (no bufferiza)
  mongoose.set('bufferCommands', false);
  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    // si usás cluster, no pongas dbName acá
    dbName: process.env.MONGO_DB || undefined,
  });

  const { host, port, name } = mongoose.connection;
  console.log(`[mongo] conectado → ${host}:${port}/${name}`);
}

export async function closeDB() {
  await mongoose.connection.close();
}
