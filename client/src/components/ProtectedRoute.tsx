import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { hasValidStoredToken } from "../utils/auth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  return <>{hasValidStoredToken() ? children : <Navigate to="/login" />}</>;
}
