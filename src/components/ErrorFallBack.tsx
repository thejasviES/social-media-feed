import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const navigate = useNavigate();

  const handleReset = () => {
    resetErrorBoundary();
    navigate("/"); // Optional: navigate to home page on reset
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-12">
      <div className="bg-white border border-gray-200 rounded-lg p-12 max-w-6xl w-full text-center">
        <h1 className="text-3xl font-bold mb-6">Something went wrong 🧐</h1>
        <p className="font-mono text-gray-500 mb-8">{error.message}</p>
        <button
          onClick={handleReset}
          className="px-6 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Try again
        </button>
      </div>
    </main>
  );
};

export default ErrorFallback;
