"use client";

import useAuth from "@/app/hooks/useAuth";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (!user || loading) return; // ✅ Ensure authentication is complete before setting values
    setName(user.name || ""); // ✅ Ensure `name` exists
    setEmail(user.email || ""); // ✅ Ensure `email` exists
  }, [user, loading]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Edit Profile</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full mt-2"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full mt-2"
      />
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Save Changes
      </button>
    </div>
  );
}
