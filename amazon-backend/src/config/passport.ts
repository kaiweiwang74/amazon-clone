import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "../config/db"; // Import database connection
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 🟢 Check if user already exists
        const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [
          profile.emails?.[0].value,
        ]);

        if (userCheck.rows.length > 0) {
          // ✅ If user exists, return existing user
          return done(null, userCheck.rows[0]);
        }

        // 🟢 Create new user if not exists
        const newUser = await pool.query(
          "INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING *",
          [profile.displayName, profile.emails?.[0].value, profile.id]
        );

        return done(null, newUser.rows[0]);
      } catch (error) {
        console.error("Google OAuth Error:", error);
        return done(error, undefined);
      }
    }
  )
);

export default passport;
