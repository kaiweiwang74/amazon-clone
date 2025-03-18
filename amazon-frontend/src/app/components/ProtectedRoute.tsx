"use client"; // ✅ 確保這是 Client Component

import { useRouter } from "next/navigation"; // ✅ 修正 import
import useAuth from "@/app/hooks/useAuth";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // ✅ 重新導向到登入頁面
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;

  return <>{user ? children : null}</>;
}
