import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();

import connectDB from "./config/db.js"; // Conexión a MongoDB
import user from "./routes/userRoutes.js";
import product from "./routes/productRoutes.js";
import sale from "./routes/saleRoutes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Rutas
app.use("/api/users", user);
app.use("/api/products", product);
app.use("/api/sales", sale);

// Puerto y conexión al servidor
const PORT = process.env.PORT || 5000;

connectDB(); // Conectar a la base de datos

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
