import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";
import { AuthFormData, User } from "../types/auth";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { LogIn } from "lucide-react";
import { login } from "../services/apiAuth";

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuthStore();

  const handleSignIn = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      const { user } = await login({
        email: data.email,
        password: data.password,
      });
      if (!user?.email) {
        throw new Error("User email is missing");
      }
      const typedUser: User = {
        id: user.id,
        email: user.email,
        created_at: user.created_at || new Date().toISOString(),
      };

      setUser(typedUser);
      setIsAuthenticated(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Successfully signed in!");

      navigate("/feed", { replace: true });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <LogIn className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AuthForm
            mode="signin"
            onSubmit={handleSignIn}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
