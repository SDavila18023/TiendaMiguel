import Sale from "../models/saleModel.js";

export const registerSale = async (req, res) => {
  try {
    const { products, totalPrice, date } = req.body;

    // Validación básica
    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ message: "La venta debe incluir productos." });
    }

    if (!totalPrice || totalPrice <= 0) {
      return res
        .status(400)
        .json({ message: "El precio total debe ser válido." });
    }

    // Crear una nueva venta
    const newSale = new Sale({
      products,
      totalPrice,
      date: date || new Date(),
    });

    // Guardar la venta en la base de datos
    const savedSale = await newSale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    res.status(500).json({ message: "Error al registrar la venta." });
  }
};

// Obtener todas las ventas
export const getAllSales = async (req, res) => {
    try {
      const sales = await Sale.find();
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  