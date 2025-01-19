import Product from "../models/productModel.js"; // Asegúrate de ajustar la ruta si es necesario

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const products = await Product.find(); // Obtener todos los productos
    let categories = new Set(); // Utilizamos un Set para evitar duplicados

    products.forEach((product) => {
      if (product.category) {
        categories.add(product.category); // Agregar categoría al Set
      }
    });

    res.status(200).json([...categories]); // Convertimos el Set a un array y lo enviamos como respuesta
  } catch (error) {
    console.error("Error al obtener las categorías de los productos:", error);
    res.status(500).json({ message: "Error al obtener las categorías" });
  }
};

export const getBrands = async (req, res) => {
  try {
    const products = await Product.find(); // Obtener todos los productos
    let brands = new Set(); // Utilizamos un Set para evitar duplicados

    products.forEach((product) => {
      if (product.brand) {
        brands.add(product.brand); // Agregar categoría al Set
      }
    });

    res.status(200).json([...brands]); // Convertimos el Set a un array y lo enviamos como respuesta
  } catch (error) {
    console.error("Error al obtener las categorías de los productos:", error);
    res.status(500).json({ message: "Error al obtener las categorías" });
  }
};

export const getSizes = async (req, res) => {
  try {
    const products = await Product.find(); // Obtener todos los productos
    let sizeProducts = new Set(); // Utilizamos un Set para evitar duplicados

    products.forEach((product) => {
      if (product.sizeProduct) {
        sizeProducts.add(product.sizeProduct); // Agregar categoría al Set
      }
    });

    res.status(200).json([...sizeProducts]); // Convertimos el Set a un array y lo enviamos como respuesta
  } catch (error) {
    console.error("Error al obtener las categorías de los productos:", error);
    res.status(500).json({ message: "Error al obtener las categorías" });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Obtener total de productos
export const getProductsCount = async (req, res) => {
  try {
    // Contar el total de productos en la base de datos
    const totalProducts = await Product.countDocuments({});
    res.status(200).json({ total: totalProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Actualizar stock
export const updateStock = async (req, res) => {
  const { products } = req.body;

  try {
    for (const item of products) {
      const { id, quantity } = item;
      const product = await Product.findById(id);

      if (product) {
        product.stock = Math.max(product.stock - quantity, 0); // Evita stock negativo
        await product.save();
      }
    }
    res.status(200).send({ message: "Stock actualizado exitosamente." });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error al actualizar el stock.", details: error });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
