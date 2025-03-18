import { Request, Response } from "express";
import pool from "../config/db";
import { Product } from "../models/productModel";

// Get all products
export const getProducts = async (req: Request, res: Response) => {
    try {
        const query = "SELECT id, name, price, image_url FROM products ORDER BY id ASC";
        console.log("🔍 Executing SQL Query:", query);

        const result = await pool.query(query);
        console.log("✅ Query Result:", result.rows);

        res.json(result.rows);
    } catch (error: unknown) { // Fix unknown type
        if (error instanceof Error) {
            console.error("❌ SQL Error:", error.message);
            res.status(500).json({ error: error.message });
        } else {
            console.error("❌ Unknown Error:", error);
            res.status(500).json({ error: "An unexpected error occurred" });
        }
    }
};




//Get single product
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
};

//Create product (need authorization)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, stock, image_url, category } = req.body as Product;

        const result = await pool.query(
            "INSERT INTO products (name, description, price, stock, image_url, category) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
            [name, description, price, stock, image_url, category]
        );

        res.status(201).json({ message: "Product created", product: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
};

//Update product (need authorization)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, image_url, category } = req.body as Product;

        const result = await pool.query(
            "UPDATE products SET name = $1, description = $2, price = $3, stock = $4, image_url = $5, category = $6 WHERE id = $7 RETURNING *",
            [name, description, price, stock, image_url, category, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.json({ message: "Product updated", product: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
};

//Delete product (need authorization)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING", [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
}