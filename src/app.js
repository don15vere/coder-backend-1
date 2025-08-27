import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";

const app = express();

// Middlewares para parsear JSON y forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Healthcheck básico
app.get("/", (_req, res) => {
  res.json({ ok: true, message: "API Backend I - Entrega 1" });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});