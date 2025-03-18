"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";

const schema = yup.object().shape({
  name: yup.string().required("請輸入姓名"),
  email: yup.string().email("無效的 Email").required("請輸入 Email"),
  password: yup.string().min(6, "密碼至少 6 碼").required("請輸入密碼"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { name: string; email: string; password: string }) => {
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/register`
          : "/api/users/register",
        data
      );
      router.push("/login");
    } catch {
      setError("註冊失敗，請確認 Email 是否已被使用");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">註冊</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">姓名</label>
            <input
              type="text"
              {...register("name")}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
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
            <label className="block text-gray-700">密碼</label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
            註冊
          </button>
        </form>
        <p className="mt-4 text-center">
          已有帳號？ <a href="/login" className="text-blue-500">登入</a>
        </p>
      </div>
    </div>
  );
}
