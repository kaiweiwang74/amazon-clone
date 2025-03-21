"use client";

import { useState } from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number | string; // 允許價格為數字或字串
  image_url: string;
  discount?: number;
  rating?: number;
  reviews?: number;
  description?: string;
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

  // ✅ 確保價格是數字
  const price = typeof product.price === "number" ? product.price : parseFloat(product.price);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 relative">
      {product.discount && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          -{product.discount}%
        </span>
      )}
      <Image
        src={product.image_url}
        alt={product.name}
        width={300}
        height={200}
        className="object-cover rounded w-full"
        priority
      />
      <h2 className="font-bold text-xl mt-2">{product.name}</h2>
      <div className="flex items-center space-x-2">
        {product.rating && <span className="text-yellow-500">⭐ {product.rating}</span>}
        {product.reviews && <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>}
      </div>
      <p className="text-gray-600 mt-1">
        {product.discount ? (
          <>
            <span className="text-red-500 text-lg font-bold">
              ${(price * (1 - product.discount / 100)).toFixed(2)}
            </span>
            <span className="text-gray-400 line-through ml-2">${price.toFixed(2)}</span>
          </>
        ) : (
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
        )}
      </p>
      <p className="text-gray-500 text-sm mt-1">{product.description}</p>
      <div className="flex justify-between items-center mt-3">
        <button
          onClick={handleAddToCart}
          className="bg-black text-white px-4 py-2 rounded w-full"
          disabled={adding}
        >
          {adding ? "Adding..." : "🛒 Add to Cart"}
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-full ml-2">♡</button>
      </div>
    </div>
  );
}
