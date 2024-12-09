import { createRoot } from "react-dom/client";
import "./index.css";

import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallBack.tsx";
import App from "./App.tsx";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.replace("/")}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>
);
