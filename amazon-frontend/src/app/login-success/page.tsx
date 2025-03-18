"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginSuccessPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LoginSuccessHandler />
    </Suspense>
  );
}

// ✅ Separate Component for using hooks
function LoginSuccessHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token); // ✅ Save token
      router.push("/"); // ✅ Redirect to home
    } else {
      console.error("No token found in URL");
      router.push("/login"); // Redirect to login if no token
    }
  }, [router, searchParams]);

  return <p className="text-xl font-semibold">Logging in... Please wait.</p>;
}

// ✅ Fallback UI while waiting for search params
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl font-semibold">Loading...</p>
    </div>
  );
}
