import { Request, Response } from "express";
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus, cancelOrder } from "../models/orderModel";

export const placeOrder = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.id;
    const { totalPrice, items } = req.body;

    console.log("Order Request:", { userId, totalPrice, items });

    if (typeof totalPrice !== "number" || totalPrice <= 0) {
        console.error("Invalid totalPrice:", totalPrice);
        res.status(400).json({ error: "Invalid total price" });
    }

    if (!items || items.length === 0) {
        console.error("No items in the order:", items);
        res.status(400).json({ error: "Order must have at least one item" });
    }

    try {
        const order = await createOrder(userId, totalPrice, items);
        res.status(201).json(order);
    } catch (error) {
        console.error("Order Creation Failed:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
};


export const getOrders = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        console.log("Fetching orders for user:", userId); // Log user ID

        const orders = await getUserOrders(userId);
        console.log("Orders retrieved:", orders); // Log retrieved orders

        res.json(orders);
    } catch (error) {
        console.error("Failed to retrieve orders:", error);
        res.status(500).json({ error: "Failed to retrieve orders", details: error });
    }
};


export const getAllOrdersForAdmin = async (req: Request, res: Response) => {
    try {
        const orders = await getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Admin Failed to retrieve orders" });
    }
};

export const changeOrderStatus = async (req: Request, res: Response) => {
    const { orderId, status } = req.body;

    try {
        const order = await updateOrderStatus(orderId, status);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: "Failed to update order status" });
    }
};

export const cancelUserOrder = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { orderId } = req.body;

    try {
        const order = await cancelOrder(orderId, userId);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: "Failed to cancel order" });
    }
};