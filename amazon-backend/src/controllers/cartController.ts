import { Request, Response } from "express";
import { addToCart, getCartItems, updateCartQuantity, removeCartItem } from "../models/cartModel";

export const addItemToCart = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { productId, quantity } = req.body;

    console.log("Attempting to add item to cart", { userId, productId, quantity });

    if (!userId) {
        console.error("❌ Error: Invalid user ID");
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    if (!productId) {
        console.error("❌ Error: Missing productId");
        res.status(400).json({ error: "Missing product ID" });
        return;
    }

    try {
        const cartItem = await addToCart(userId, productId, quantity);
        console.log("✅ Successfully added to cart:", cartItem);
        res.status(201).json(cartItem);
    } catch (error) {
        console.error("❌ Failed to add item to cart:", error);
        res.status(500).json({ error: "Unable to add item to cart", message: (error as Error).message });
    }
};

export const getUserCart = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    
    try {
        const cartItems = await getCartItems(userId);
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: "Unable to retrieve cart items" });
    }
};

export const updateCartItem = async (req: Request, res: Response) => {
    const { cartId, quantity } = req.body;

    try {
        const updatedItem = await updateCartQuantity(cartId, quantity);
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: "Unable to update cart item quantity" });
    }
};

export const deleteCartItem = async (req: Request, res: Response) => {
    const { cartId } = req.params;

    try {
        await removeCartItem(Number(cartId));
        res.json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ error: "Unable to delete cart item" });
    }
};
