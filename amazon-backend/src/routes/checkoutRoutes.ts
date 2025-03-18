import express from "express";
import { createCheckoutSession } from "../controllers/checkoutController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/checkout", verifyToken, createCheckoutSession);

export default router;
