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

router.post("/", verifyToken, placeOrder); 
router.get("/", verifyToken, getOrders); 
router.get("/all", verifyToken, verifyAdmin, getAllOrdersForAdmin); 
router.put("/status", verifyToken, verifyAdmin, changeOrderStatus); 
router.put("/cancel", verifyToken, cancelUserOrder); 

export default router;
