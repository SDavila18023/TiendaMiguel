import express from "express";

const user = express.Router();

import { loginUser, registerUser } from "../controllers/userController.js";

// Rutas
user.post("/login", loginUser); // Ruta para iniciar sesión
user.post("/register", registerUser); // Ruta para registrar usuarios

export default user;
