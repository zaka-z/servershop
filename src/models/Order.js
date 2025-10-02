// server/src/models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, min: 1, required: true },
        unitPrice: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "shipped"], default: "pending" },
    shipping: {
      address: String,
      postalCode: String,
      phone: String,
    },
    paymentRef: String, // برای موک پرداخت
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);