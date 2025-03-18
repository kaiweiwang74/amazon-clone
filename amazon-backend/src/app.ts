import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";
import orderRoutes from "./routes/orderRoutes";
import passport from "passport";
import authRoutes from "./routes/authRoutes";
import session from "express-session";
import './config/passport'; // Import the passport configuration here

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Session configuration
app.use(
  session({
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes); // Changed from "/api/auth" to "/auth" to match your callback URL

// Error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("🔥 伺服器錯誤：", err);
  res.status(500).json({ error: "伺服器內部錯誤", message: err.message });
};

app.use(errorHandler);

export default app;