"use client";

import { useEffect, useState } from "react";
import ProductCategories from "./components/ProductCategories";
import ProductCard from "./components/ProductCard";


// 定義 Product 介面
interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  discount?: number;
  rating?: number;
  reviews?: number;
  description?: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        console.log("🔍 API Response from Backend:", data);
  
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("❌ API returned incorrect format:", data);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ProductCategories />
      <div className="mt-8 mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold">Featured Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No products available at the moment.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
