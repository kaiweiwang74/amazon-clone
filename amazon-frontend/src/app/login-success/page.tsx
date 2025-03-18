"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token); // ✅ Save token
      router.push("/"); // ✅ Redirect to home
    } else {
      console.error("No token found in URL");
      router.push("/login"); // Redirect to login if no token
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl font-semibold">Logging in... Please wait.</p>
    </div>
  );
}
