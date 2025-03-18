"use client"; // ✅ Ensures this is a Client Component

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image"; // ✅ Import Next.js Image Component

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string; // ✅ Use "image_url" to match backend response
  description: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string; // ✅ Ensure id is treated as string
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      {/* ✅ Replaced <img> with Next.js <Image> */}
      <Image
        src={product.image_url} // ✅ Make sure backend returns "image_url"
        alt={product.name}
        width={600} // Set width
        height={400} // Set height
        className="object-cover rounded"
        priority // Optimize for fast loading
      />
      <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
      <p className="text-gray-600 text-lg">{product.description}</p>
      <p className="text-2xl font-semibold mt-2">${product.price.toFixed(2)}</p>
      <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Add to Cart
      </button>
    </div>
  );
}
