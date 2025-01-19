import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  products: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now, required: true },
});

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
