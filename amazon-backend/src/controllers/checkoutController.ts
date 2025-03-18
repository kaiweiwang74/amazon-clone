import { Request, Response } from "express";
import stripe from "../config/stripe";
import pool from "../config/db";

export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;

  try {
    // 🛒 Get cart items
    const { rows: cartItems } = await pool.query(
      "SELECT p.id, p.name, p.price, c.quantity FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1",
      [userId]
    );

    if (cartItems.length === 0) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }

    // 💰 Prepare Stripe items
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // 🧾 Create a payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};
