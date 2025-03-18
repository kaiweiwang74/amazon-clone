"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

// 定義 Product 介面
interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]); // ✅ 指定 products 為 Product 陣列
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        console.log("🔍 API Response from Backend:", data); // ✅ Debugging log
  
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("❌ API returned incorrect format:", data);
          setProducts([]); // Ensure products is at least an empty array
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);
  

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>There are no products to display at this time.</p>
      )}
    </div>
  );
}
