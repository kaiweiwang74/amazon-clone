import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile } from "../controllers/userController";
import { verifyToken } from "../middleware/authMiddleware";
import { AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", verifyToken, async (req: express.Request, res) => {
    await getUserProfile(req as AuthRequest, res);
  });
  
  router.put("/profile", verifyToken, async (req: express.Request, res) => {
    await updateUserProfile(req as AuthRequest, res);
  });

export default router;
