import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            localStorage.removeItem("token");
            setUser(null);
          } else {
            setUser(data as User); // ✅ Cast response as `User`
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return { user, loading };
}
