import { Navigate } from "react-router-dom";

import { useUser } from "../queries/useUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useUser();
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate("/signin");
    },
    [isAuthenticated, isLoading, navigate]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// function ProtectedRoute({ children }) {
//   const navigate = useNavigate();

//   // 1. Load the authenticated user
//   const { isLoading, isAuthenticated } = useUser();

//   // 2. If there is NO authenticated user, redirect to the /login
//   useEffect(
//     function () {
//       if (!isAuthenticated && !isLoading) navigate("/login");
//     },
//     [isAuthenticated, isLoading, navigate]
//   );

//   // 3. While loading, show a spinner
//   if (isLoading)
//     return (
//       <FullPage>
//         <Spinner />
//       </FullPage>
//     );

//   // 4. If there IS a user, render the app
//   if (isAuthenticated) return children;
// }

export default ProtectedRoute;
