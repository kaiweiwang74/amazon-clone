"use client";

import { useState } from "react";
import Image from "next/image"; // ✅ Import Next.js Image Component

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    const token = localStorage.getItem("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(`✅ ${product.name} added to cart`);
    } else {
      alert(`❌ Failed to add: ${data.error}`);
    }
    setAdding(false);
  };

  return (
    <div className="border p-4 rounded-lg shadow-lg">
      {/* ✅ Replaced <img> with Next.js <Image> */}
      <Image
        src={product.image_url}
        alt={product.name}
        width={200} // Set width (adjust as needed)
        height={160} // Set height (adjust as needed)
        className="object-cover rounded"
        priority // Optimize for fast loading
      />
      <h2 className="font-bold text-lg">{product.name}</h2>
      <p className="text-gray-600">${Number(product.price).toFixed(2)}</p>
      <button
        onClick={handleAddToCart}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
        disabled={adding}
      >
        {adding ? "Adding..." : "🛒 Add to Cart"}
      </button>
    </div>
  );
}
