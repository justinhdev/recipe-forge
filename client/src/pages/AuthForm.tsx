import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type {
  LoginUserRequest,
  RegisterUserRequest,
} from "../types/contracts";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type Props = {
  isLogin?: boolean;
};

export default function AuthForm({ isLogin = false }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    const url = isLogin
      ? `${API_BASE_URL}/api/auth/login`
      : `${API_BASE_URL}/api/auth/register`;

    const payload: LoginUserRequest | RegisterUserRequest = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      const res = await axios.post(url, payload);
      localStorage.setItem("token", res.data.token);
      if (!isLogin) {
        localStorage.setItem("name", name);
      }
      navigate("/generate");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 sm:mt-12 bg-white dark:bg-gray-900 shadow dark:shadow-lg rounded duration-300">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white duration-300">
        {isLogin ? "Login" : "Register"}
      </h2>
      {!isLogin && (
        <input
          type="text"
          placeholder="Name"
          className="w-full px-4 py-3 text-base border rounded mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 duration-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-3 text-base border rounded mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 duration-300"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-3 text-base border rounded mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 duration-300"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300"
        onClick={handleSubmit}
      >
        {isLogin ? "Login" : "Register"}
      </button>
      {error && (
        <p className="text-red-500 mt-3 text-sm dark:text-red-400 duration-300">
          {error}
        </p>
      )}
    </div>
  );
}
