import express from "express";
import { getAllSales, registerSale } from "../controllers/saleController.js";

const sale = express.Router();

// Rutas
sale.post("/register", registerSale); // Ruta para iniciar sesión
sale.get("/", getAllSales);

export default sale;
