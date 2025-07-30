import User from "../models/userModel.js";
import bcrypt from "bcrypt";

// Controlador para iniciar sesión
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Comparar la contraseña con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

// Controlador para registrar usuarios
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    // Hashear la contraseña antes de guardarla
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el nuevo usuario con la contraseña hasheada
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser._id,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
};
