import express from "express";
import { addItemToCart, getUserCart, updateCartItem, deleteCartItem } from "../controllers/cartController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", verifyToken, addItemToCart);
router.get("/", verifyToken, getUserCart);
router.put("/", verifyToken, updateCartItem);
router.delete("/:cartId", verifyToken, deleteCartItem);

export default router;
