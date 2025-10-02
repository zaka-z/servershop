// server/src/routes/products.js
import { Router } from "express";
import Product from "../models/Product.js";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";

const router = Router();

// لیست محصولات عمومی
router.get("/", async (req, res) => {
  const products = await Product.find({ isActive: true }).sort("-createdAt");
  res.json(products);
});

// دریافت یک محصول
router.get("/:id", async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

// ایجاد/ویرایش/حذف فقط برای ادمین
router.post("/", auth, adminOnly, async (req, res) => {
  const p = await Product.create(req.body);
  res.status(201).json(p);
});

router.put("/:id", auth, adminOnly, async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(p);
});

router.delete("/:id", auth, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;