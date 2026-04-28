import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import type { FormEvent } from "react";
import type { LoginUserRequest, RegisterUserRequest } from "../types/contracts";
import api from "../utils/api";
import { Anvil } from "lucide-react";

type Props = {
  isLogin?: boolean;
};

type AuthResponse = {
  token: string;
  name?: string;
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
      const res = await api.post<AuthResponse>(url, payload);
      localStorage.setItem("token", res.data.token);
      const displayName = res.data.name ?? (!isLogin ? name : "");
      if (displayName) localStorage.setItem("name", displayName);
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

  const inputClass =
    "w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4 py-8 transition-colors duration-300 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none mb-1">
            <Anvil size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Recipe Forge
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isLogin
              ? "Welcome back — sign in to your account"
              : "Create an account to start generating recipes"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:shadow-none sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            {isLogin ? "Login" : "Register"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {!isLogin && (
              <input
                type="text"
                placeholder="Name"
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isLogin ? 1 : 8}
              maxLength={128}
            />

            {error && (
              <p className="rounded-lg bg-red-50 dark:bg-red-950 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70 dark:bg-blue-500 dark:shadow-none dark:hover:bg-blue-600"
            >
              {submitting
                ? "Please wait…"
                : isLogin
                  ? "Login"
                  : "Register"}
            </button>
          </form>
        </div>

        {/* Toggle link */}
        <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            to={isLogin ? "/register" : "/login"}
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}
