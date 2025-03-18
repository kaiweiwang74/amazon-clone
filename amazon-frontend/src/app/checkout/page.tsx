"use client";

import { useState } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // Redirect to Stripe Checkout
    } else {
      alert("Failed to initiate checkout");
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <button
        onClick={handleCheckout}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
}
