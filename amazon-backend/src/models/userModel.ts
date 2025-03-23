// src/models/userModel.ts
import pool from "../config/db";
import { QueryResult } from "pg";

export const findUserByEmail = async (email: string): Promise<QueryResult> => {
  return pool.query("SELECT * FROM users WHERE email = $1", [email]);
};

export const createUser = async (name: string, email: string, password: string): Promise<QueryResult> => {
  return pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, password]
  );
};

export const findUserById = async (id: number): Promise<QueryResult> => {
  return pool.query("SELECT id, name, email FROM users WHERE id = $1", [id]);
};

export const getRawUserById = async (id: number): Promise<QueryResult> => {
  return pool.query("SELECT * FROM users WHERE id = $1", [id]);
};

export const updateUser = async (
  id: number,
  name: string,
  email: string,
  password: string
): Promise<QueryResult> => {
  return pool.query(
    "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email",
    [name, email, password, id]
  );
};
