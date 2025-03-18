import { Request, Response } from "express";
import { addToCart, getCartItems, updateCartQuantity, removeCartItem } from "../models/cartModel";

export const addItemToCart = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { productId, quantity } = req.body;

    console.log("🛒 嘗試加入購物車", { userId, productId, quantity });

    if (!userId) {
        console.error("❌ 錯誤：無效的用戶 ID");
        res.status(401).json({ error: "未授權" });
        return;
    }

    if (!productId) {
        console.error("❌ 錯誤：缺少 productId");
        res.status(400).json({ error: "缺少商品 ID" });
        return;
    }

    try {
        const cartItem = await addToCart(userId, productId, quantity);
        console.log("✅ 成功加入購物車：", cartItem);
        res.status(201).json(cartItem);
    } catch (error) {
        console.error("❌ 加入購物車失敗：", error);
        res.status(500).json({ error: "無法加入購物車", message: (error as Error).message });
    }
};

export const getUserCart = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    
    try {
        const cartItems = await getCartItems(userId);
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: "無法獲取購物車資料" });
    }
};

export const updateCartItem = async (req: Request, res: Response) => {
    const { cartId, quantity } = req.body;

    try {
        const updatedItem = await updateCartQuantity(cartId, quantity);
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: "無法更新購物車數量" });
    }
};

export const deleteCartItem = async (req: Request, res: Response) => {
    const { cartId } = req.params;

    try {
        await removeCartItem(Number(cartId));
        res.json({ message: "商品已從購物車移除" });
    } catch (error) {
        res.status(500).json({ error: "無法刪除購物車商品" });
    }
};
