import pool from "../config/db";

const addToCart = async (userId: number, productId: number, quantity: number = 1) => {
    try {
        console.log("🟡 執行 SQL，userId:", userId, "productId:", productId, "quantity:", quantity);
        const { rows } = await pool.query(
            "INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
            [userId, productId, quantity]
        );
        return rows[0];
    } catch (error) {
        console.error("❌ SQL 錯誤:", error);
        throw error;
    }
};


const getCartItems = async (userId: number) => {
    const { rows } = await pool.query(
        "SELECT c.id, c.quantity, p.name, p.price, p.image_url FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1",
        [userId]
    );
    return rows;
}

const updateCartQuantity = async (cartId: number, quantity: number) => {
    const { rows } = await pool.query(
        "UPDATE cart_item SET quantity = $1 WHERE id = $2 RETURNING *",
        [quantity, cartId]
    );
    return rows[0];
};

const removeCartItem = async (cartId: number) => {
    await pool.query("DELETE FROM cart_items WHERE id = $1", [cartId]);
};


export { addToCart, getCartItems, updateCartQuantity, removeCartItem };




