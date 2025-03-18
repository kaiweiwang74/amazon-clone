import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/productController";
import { verifyToken } from "../middleware/authMiddleware";
import { verifyAdmin } from "../middleware/adminMiddleware";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

// ✅ Ensure admin access for product modifications
router.post("/", verifyToken, verifyAdmin, createProduct);
router.put("/:id", verifyToken, verifyAdmin, updateProduct);
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

export default router;
