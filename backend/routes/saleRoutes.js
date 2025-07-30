import express from "express";
import { deleteAllSales, getAllSales, registerSale } from "../controllers/saleController.js";

const sale = express.Router();

// Rutas
sale.post("/register", registerSale); // Ruta para iniciar sesión
sale.get("/", getAllSales);
sale.delete("/delete",deleteAllSales)

export default sale;
