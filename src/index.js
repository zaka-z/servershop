import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";

dotenv.config();
const app = express();

// CORS برای همه دامنه‌ها یا دامنه دیپلوی‌شده
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "*", // در .env مقدار دقیق بده
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));

// مسیر تست
app.get("/", (req, res) => res.json({ ok: true, msg: "Shop API" }));

// مسیرهای اصلی
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// اجرای سرور
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
};

start();