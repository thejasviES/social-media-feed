import { Navigate } from "react-router-dom";

import { useUser } from "../queries/useUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useUser();
  console.log("isLoading", isLoading);
  console.log("isAuthenticated", isAuthenticated);
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate("/signin");
    },
    [isAuthenticated, isLoading, navigate]
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
