import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { hasValidStoredToken } from "../utils/auth";

export default function Register() {
  const navigate = useNavigate();
  useEffect(() => {
    if (hasValidStoredToken()) {
      navigate("/generate");
    }
  }, [navigate]);

  return <AuthForm />;
}
