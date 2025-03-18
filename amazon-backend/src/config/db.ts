import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Log to check if DATABASE_URL is loaded
console.log("🔍 DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // ✅ Use Render PostgreSQL URL
  ssl: {
    rejectUnauthorized: false, // ✅ Required for Render DB
  },
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL Database"))
  .catch((err) => console.error("❌ Database connection error:", err));

export default pool;
