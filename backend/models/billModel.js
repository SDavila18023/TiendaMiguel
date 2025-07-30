import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
    purchaseDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        type: String,
        required: true
    },
    supplier: {
        type: String,
        required: true
    },
    products: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Middleware para calcular el total antes de guardar
billSchema.pre('save', function(next) {
    this.totalAmount = this.products.reduce((total, product) => {
        return total + (product.price * product.quantity);
    }, 0);
    next();
});

const Bill = mongoose.models.Bill || mongoose.model('Bill', billSchema);

export default Bill;