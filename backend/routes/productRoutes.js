import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
  getSizes,
  updateStock,
  getProductsCount,
  importCSV,
  deleteAllProducts,
} from "../controllers/productController.js";

const product = express.Router();

product.post("/products", createProduct);
product.post("/import-csv",importCSV);
product.get("/categories", getCategories);
product.get("/sizeProducts", getSizes);
product.get("/brands", getBrands);
product.get("/products", getAllProducts);
product.get("/products/:id", getProductById);
product.get("/total", getProductsCount);
product.put("/products/:id", updateProduct);
product.put("/update-stock", updateStock);
product.delete("/products/:id", deleteProduct);
product.delete("/delete", deleteAllProducts);

export default product;
