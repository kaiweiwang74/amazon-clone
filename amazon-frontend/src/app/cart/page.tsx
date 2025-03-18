"use client";

import useAuth from '@/hooks/useAuth';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image"; // ✅ Import Next.js Image Component

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export default function CartPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      setTimeout(() => router.push("/login"), 2000);
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || loading) return;

    const token = localStorage.getItem("token");

    fetch(`https://amazon-clone-byub.onrender.com/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error("❌ Failed to fetch cart:", err))
      .finally(() => setCartLoading(false));
  }, [user, loading]);

  // ✅ DELETE ITEM FROM CART
  const handleDelete = async (cartId: number) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${cartId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setCartItems(cartItems.filter((item) => item.id !== cartId));
    } else {
      console.error("❌ Failed to delete item.");
    }
  };

  // ✅ TOTAL PRICE CALCULATION
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 text-xl font-bold">
          ⚠️ Please login to access your cart.
        </p>
        <p className="text-gray-500">Redirecting to login page...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🛒 My Cart</h1>

      {cartLoading ? (
        <p>Loading...</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="cart-item flex items-center justify-between border p-4 rounded"
              >
                <div className="flex items-center space-x-4">
                  {/* ✅ Replaced <img> with Next.js <Image> */}
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={64} // 64px
                    height={64} // 64px
                    className="rounded"
                    priority // Optimize for fast loading
                  />
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p>${Number(item.price).toFixed(2)}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  ❌ Remove
                </button>
              </div>
            ))}
          </ul>

          {/* ✅ Total Price */}
          <div className="mt-6 text-lg font-bold">
            Total: ${totalPrice.toFixed(2)}
          </div>

          {/* ✅ Checkout Button */}
          <button
            onClick={() => router.push("/checkout")}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded w-full"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
