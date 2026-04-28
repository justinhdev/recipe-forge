import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import type {
  LoginUserRequest,
  RegisterUserRequest,
} from "../types/contracts";
import api from "../utils/api";

type Props = {
  isLogin?: boolean;
};

export default function AuthForm({ isLogin = false }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);
    const url = isLogin ? "/api/auth/login" : "/api/auth/register";

    const payload: LoginUserRequest | RegisterUserRequest = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      const res = await api.post(url, payload);
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="max-w-md mx-auto px-4 py-6 sm:mt-12 bg-white dark:bg-gray-900 shadow dark:shadow-lg rounded duration-300"
      onSubmit={handleSubmit}
    >
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
          required
          maxLength={100}
        />
      )}
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-3 text-base border rounded mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 duration-300"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-3 text-base border rounded mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 duration-300"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={isLogin ? 1 : 8}
        maxLength={128}
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300"
        disabled={submitting}
      >
        {submitting ? "Please wait..." : isLogin ? "Login" : "Register"}
      </button>
      {error && (
        <p className="text-red-500 mt-3 text-sm dark:text-red-400 duration-300">
          {error}
        </p>
      )}
    </form>
  );
}
