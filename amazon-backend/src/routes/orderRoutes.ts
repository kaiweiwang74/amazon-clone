import express from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { verifyAdmin } from "../middleware/adminMiddleware";
import {
  placeOrder,
  getOrders,
  getAllOrdersForAdmin,
  changeOrderStatus,
  cancelUserOrder,
} from "../controllers/orderController";

const router = express.Router();

router.post("/", verifyToken, placeOrder); // ✅ Place an order
router.get("/", verifyToken, getOrders); // ✅ Get user orders
router.get("/all", verifyToken, verifyAdmin, getAllOrdersForAdmin); // ✅ Admin: Get all orders
router.put("/status", verifyToken, verifyAdmin, changeOrderStatus); // ✅ Admin: Update order status
router.put("/cancel", verifyToken, cancelUserOrder); // ✅ User: Cancel an order

export default router;
