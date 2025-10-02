import dotenv from "dotenv";
import { connectDB } from "./db.js";
import User from "./models/User.js";
import Product from "./models/Product.js";

dotenv.config();

(async () => {
  await connectDB(process.env.MONGODB_URI);
  await User.deleteMany({});
  await Product.deleteMany({});

  const admin = await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  });

  await Product.insertMany([
    { title: "گوشی هوشمند", description: "مدل X", price: 12000000, stock: 10 },
    { title: "لپ‌تاپ", description: "Core i7", price: 35000000, stock: 5 },
    { title: "هدفون", description: "بی‌سیم", price: 1500000, stock: 20 },
  ]);

  console.log("✅ Seed done. Admin:", admin.email, "pass: admin123");
  process.exit(0);
})();