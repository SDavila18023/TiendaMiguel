import Bill from "../models/billModel.js";

// CREATE - Crear una nueva factura
export const createBill = async (req, res) => {
    try {
        const bill = new Bill(req.body);
        await bill.save();
        res.status(201).json({
            success: true,
            message: "Factura creada exitosamente",
            data: bill
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
};

// READ - Obtener todas las facturas
export const getAllBills = async (req, res) => {
    try {
        const { page = 1, limit = 10, supplier, startDate, endDate } = req.query;
        
        // Construir filtros
        const filters = {};
        if (supplier) {
            filters.supplier = { $regex: supplier, $options: 'i' };
        }
        if (startDate || endDate) {
            filters.purchaseDate = {};
            if (startDate) filters.purchaseDate.$gte = new Date(startDate);
            if (endDate) filters.purchaseDate.$lte = new Date(endDate);
        }

        const bills = await Bill.find(filters)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Bill.countDocuments(filters);

        res.status(200).json({
            success: true,
            data: bills,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// READ - Obtener una factura por ID
export const getBillById = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        
        if (!bill) {
            return res.status(404).json({ 
                success: false,
                message: "Factura no encontrada" 
            });
        }

        res.status(200).json({
            success: true,
            data: bill
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// UPDATE - Actualizar una factura
export const updateBill = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, supplier, purchaseDate, products, totalAmount } = req.body;

        // Validaciones básicas
        if (!description || !supplier || !purchaseDate || !products || !Array.isArray(products)) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son requeridos: description, supplier, purchaseDate, products"
            });
        }

        // Validar que hay al menos un producto
        if (products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Debe haber al menos un producto en la factura"
            });
        }

        // Validar cada producto
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            if (!product.name || !product.price || !product.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Producto ${i + 1}: nombre, precio y cantidad son requeridos`
                });
            }
            
            if (product.price <= 0 || product.quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `Producto ${i + 1}: precio y cantidad deben ser mayores a 0`
                });
            }
        }

        // Calcular el total automáticamente (por seguridad, no confiar solo en el frontend)
        const calculatedTotal = products.reduce((sum, product) => {
            return sum + (parseFloat(product.price) * parseInt(product.quantity));
        }, 0);

        // Preparar los datos para actualizar
        const updateData = {
            description: description.trim(),
            supplier: supplier.trim(),
            purchaseDate: new Date(purchaseDate),
            products: products.map(product => ({
                name: product.name.trim(),
                price: parseFloat(product.price),
                quantity: parseInt(product.quantity)
            })),
            totalAmount: calculatedTotal,
            updatedAt: new Date()
        };

        // Actualizar la factura
        const bill = await Bill.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true, // Retorna el documento actualizado
                runValidators: true // Ejecuta las validaciones del esquema
            }
        );

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: "Factura no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            message: "Factura actualizada exitosamente",
            data: bill
        });

    } catch (error) {
        console.error('Error al actualizar factura:', error);
        
        // Manejo específico de errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Error de validación",
                errors: errors
            });
        }

        // Manejo de errores de ID inválido
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "ID de factura inválido"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
};

// DELETE - Eliminar una factura
export const deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findByIdAndDelete(req.params.id);

        if (!bill) {
            return res.status(404).json({ 
                success: false,
                message: "Factura no encontrada" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Factura eliminada exitosamente",
            data: bill
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// ESTADÍSTICAS - Obtener estadísticas de facturas
export const getBillStats = async (req, res) => {
    try {
        const stats = await Bill.aggregate([
            {
                $group: {
                    _id: null,
                    totalBills: { $sum: 1 },
                    totalAmount: { $sum: "$totalAmount" },
                    averageAmount: { $avg: "$totalAmount" },
                    maxAmount: { $max: "$totalAmount" },
                    minAmount: { $min: "$totalAmount" }
                }
            }
        ]);

        // Estadísticas por proveedor
        const supplierStats = await Bill.aggregate([
            {
                $group: {
                    _id: "$supplier",
                    totalBills: { $sum: 1 },
                    totalAmount: { $sum: "$totalAmount" }
                }
            },
            { $sort: { totalAmount: -1 } },
            { $limit: 10 }
        ]);

        // Estadísticas por mes
        const monthlyStats = await Bill.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$purchaseDate" },
                        month: { $month: "$purchaseDate" }
                    },
                    totalBills: { $sum: 1 },
                    totalAmount: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 12 }
        ]);

        res.status(200).json({
            success: true,
            data: {
                general: stats[0] || {},
                topSuppliers: supplierStats,
                monthlyStats: monthlyStats
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// BUSCAR - Buscar facturas por texto
export const searchBills = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                message: "Parámetro de búsqueda requerido"
            });
        }

        const bills = await Bill.find({
            $or: [
                { supplier: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { "products.name": { $regex: q, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bills,
            count: bills.length
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};