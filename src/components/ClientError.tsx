import { Home, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ClientError() {
  const reset = () => {
    window.location.reload();
  };
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen">
      <div className="flex items-center justify-center min-h-screen bg-gray-300 text-white">
        <div className="text-center space-y-8">
          <h1 className="text-9xl font-bold text-gray-700">404</h1>
          <div className="space-y-4">
            <p className="text-2xl font-semibold">Oops! Something went wrong</p>
            <p className="text-gray-400">
              We're sorry, but an error occurred on this page.
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={reset}
              className="px-6 py-3 text-lg font-semibold text-black bg-white rounded-full transition duration-300 ease-in-out hover:bg-gray-200 hover:scale-105 flex items-center space-x-2"
            >
              <RefreshCcw size={20} />
              <span>Try Again</span>
            </button>

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
    </div>
  );
}
