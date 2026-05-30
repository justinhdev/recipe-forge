import AuthForm from "./AuthForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hasValidStoredToken } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    if (hasValidStoredToken()) {
      navigate("/generate");
    }
  }, [navigate]);

  return <AuthForm isLogin />;
}
