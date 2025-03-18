"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timeout = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="container mx-auto text-center p-6">
      <h1 className="text-3xl font-bold text-red-500">❌ Payment Canceled</h1>
      <p className="text-gray-600 mt-2">Your payment was not completed.</p>
      <p className="text-gray-500">If this was a mistake, you can try again.</p>

      <button
        onClick={() => router.push("/cart")}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded"
      >
        Back to Cart
      </button>
    </div>
  );
}
