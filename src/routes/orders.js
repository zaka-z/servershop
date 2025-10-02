// server/src/routes/orders.js
import { Router } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";

const router = Router();

// ثبت سفارش (پرداخت موک)
router.post("/", auth, async (req, res) => {
  const { items, shipping } = req.body; // [{product, quantity}]
  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: "No items" });

  const dbItems = await Promise.all(
    items.map(async (it) => {
      const prod = await Product.findById(it.product);
      if (!prod || !prod.isActive) throw new Error("Invalid product");
      return { product: prod._id, quantity: it.quantity, unitPrice: prod.price };
    })
  );

  const total = dbItems.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);

  // پرداخت موک: موفقیت و تولید ref
  const paymentRef = "PAY-" + Date.now();

  const order = await Order.create({
    user: req.user._id,
    items: dbItems,
    total,
    status: "paid",
    shipping,
    paymentRef,
  });

  res.status(201).json(order);
});

// سفارشات کاربر
router.get("/my", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("items.product");
  res.json(orders);
});

// همه سفارشات و مشخصات کاربران (ادمین)
router.get("/", auth, adminOnly, async (req, res) => {
  const orders = await Order.find().populate("user").populate("items.product").sort("-createdAt");
  res.json(orders);
});

export default router;