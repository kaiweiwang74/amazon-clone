import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // ✅ Use Render PostgreSQL URL
  ssl: {
    rejectUnauthorized: false, // ✅ Required for Render DB
  },
});

pool.connect()
  .then(() => console.log(`✅ Connected to PostgreSQL Database: ${process.env.DB_NAME}`))
  .catch((err) => console.error("❌ Database connection error:", err));

export default pool;

