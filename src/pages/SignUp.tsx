import { UserPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";
import { signup } from "../services/apiAuth";
import { AuthFormData, User } from "../types/auth";
import { useAuthStore } from "../store/authStore";

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuthStore();
  const handleSignUp = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      const { user } = await signup({
        email: data.email,
        password: data.password,
        fullName: data.fullName || "",
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
      toast.success("Welcome to Social Media!");
      navigate("/feed", { replace: true });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <UserPlus className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AuthForm
            mode="signup"
            onSubmit={handleSignUp}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
