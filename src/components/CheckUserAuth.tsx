import { useEffect } from "react";

import { useAuthStore } from "../store/authStore.ts";
import { useUser } from "../queries/useUser.ts";
import { User } from "../types/auth.ts";

const CheckUserAuth = () => {
  const { isLoading, user: userData, isAuthenticated } = useUser();
  const { setUser, setIsAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!user && userData?.email) {
      const typedUser: User = {
        id: userData.id,
        email: userData?.email,
        created_at: userData.created_at || new Date().toISOString(),
      };

      setUser(typedUser);
      setIsAuthenticated(true);
    }
  }, [isAuthenticated, isLoading, user, userData, setUser, setIsAuthenticated]);

  return null;
};

export default CheckUserAuth;
