import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication failed" });
    }

    // 🟢 Ensure user data is available
    const user = req.user as { id: number; email: string; name: string };

    // 🟢 Generate JWT Token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // ✅ Redirect to frontend with token
    res.redirect(`http://localhost:3000/login-success?token=${token}`);
  }
);

export default router;
