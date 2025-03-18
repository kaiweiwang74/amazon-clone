"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";

const schema = yup.object().shape({
  email: yup.string().email("Invalid Email").required("Please enter Email"),
  password: yup.string().min(6, "The password must be at least 6 digits.").required("Please enter password"),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, data);
      localStorage.setItem("token", res.data.token);
      router.push("/");
    } catch {
      setError("Login failed, please check your email or password.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Sign in</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          <button className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
        </form>
        <p className="mt-4 text-center">
          No account? <a href="/register" className="text-blue-500">Sign up</a>
        </p>
      </div>

      {/* Google Sign-in */}
      <div className="mt-6">
        <h1 className="text-xl font-bold mb-4">Or Sign in with</h1>
        <a
          href={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google` : "/api/auth/google"}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Sign in with Google
        </a>
      </div>
    </div>
  );
}
