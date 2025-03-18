"use client"; // ✅ 確保這是 Client Component

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default function ProductDetailPage() {
  const { id } = useParams(); // ✅ 取得動態路由的 ID
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
      <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
      <p className="text-gray-600 text-lg">{product.description}</p>
      <p className="text-2xl font-semibold mt-2">${product.price}</p>
      <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Add to Cart
      </button>
    </div>
  );
}
