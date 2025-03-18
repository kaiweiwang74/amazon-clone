import pool from "../config/db";

export const createOrder = async (userId: number, totalPrice: number, items: any[]) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const orderResult = await client.query(
            "INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING id",
            [userId, totalPrice] 
        );
        const orderId = orderResult.rows[0].id;

        for (const item of items) {
            const productRes = await client.query(
                "SELECT price FROM products WHERE id = $1",
                [item.product_id]
            );
            const productPrice = productRes.rows[0]?.price;
        
            if (productPrice === undefined) {
                throw new Error(`Product with ID ${item.product_id} not found.`);
            }
        
            await client.query(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
                [orderId, item.product_id, item.quantity, productPrice] // ✅ Use fetched price
            );
        }
        
        await client.query("COMMIT");
        return { orderId };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }finally {
        client.release();
    }
};

export const getUserOrders = async (userId: number) => {
    const { rows } = await pool.query(
        "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
    );
    return rows;
};

export const getAllOrders = async () => {
    const { rows } = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    return rows;
}

export const updateOrderStatus = async (orderId: number, status: string) => {
    const { rows } = await pool.query(
        "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
        [status, orderId]
    );
    return rows[0];
}

export const cancelOrder = async (order_id: number, userId: number) => {
    const { rows } = await pool.query(
        "UPDATE orders SET status = 'cancelled' WHERE id = $1 AND user_id = $2 RETURNING *",
        [order_id, userId]
    )

    return rows[0];
};