"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import useAuth from "@/app/hooks/useAuth";

const Navbar = () => {
  const { user, loading } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/login"; // 重新導向登入頁面
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold">My Store</span>
        </Link>
        <div className="space-x-4">
          <Link href="/cart" className="hover:text-gray-300">
            Cart
          </Link>
          <Link href="/profile" className="hover:text-gray-300">
            Profile
          </Link>

          {!loading &&
            (isLoggedIn ? (
              <button onClick={handleLogout} className="hover:text-gray-300">
                Logout
              </button>
            ) : (
              <Link href="/login" className="hover:text-gray-300">
                Login
              </Link>
            ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
