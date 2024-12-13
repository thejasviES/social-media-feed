import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen">
      <div className="flex items-center justify-center min-h-screen bg-gray-300 text-white">
        <div className="text-center space-y-8">
          <h1 className="text-9xl font-bold text-gray-700">404</h1>
          <div className="space-y-4">
            <p className="text-2xl font-semibold">Oops! Page not found</p>
            <p className="text-gray-400">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="inline-block px-6 py-3 text-lg font-semibold text-black bg-white rounded-full transition duration-300 ease-in-out hover:bg-gray-200 hover:scale-105"
          >
            <div className="flex items-center space-x-2">
              <Home size={20} />
              <span>Back to Home</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
