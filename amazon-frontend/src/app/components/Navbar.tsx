"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import useAuth from '@/hooks/useAuth';
import { ShoppingCartIcon, UserIcon } from "@heroicons/react/16/solid";


const Navbar = () => {
  const { user, loading } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <nav className="bg-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          My E-Commerce
        </Link>
        
        {/* Search Bar */}
        <input
          type="text"
          placeholder="搜尋商品..."
          className="border p-2 rounded w-1/3"
        />
        
        {/* Icons */}
        <div className="flex items-center gap-6 text-gray-700">
          <Link href="/profile" className="hover:text-gray-500">
            <UserIcon className="h-6 w-6" />
          </Link>
          <Link href="/cart" className="hover:text-gray-500">
            <ShoppingCartIcon className="h-6 w-6" />
          </Link>
          {!loading &&
            (isLoggedIn ? (
              <button onClick={handleLogout} className="hover:text-gray-500 text-sm">🚪 Logout</button>
            ) : (
              <Link href="/login" className="hover:text-gray-500 text-sm">Login</Link>
            ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;