import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Home from "./pages/Home.tsx";
import Profile from "./pages/Profile.tsx";
import { SignIn } from "./pages/SignIn.tsx";
import { SignUp } from "./pages/SignUp.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { Toaster } from "react-hot-toast";
import { CreatePost } from "./pages/CreatePost.tsx";
import Feed from "./pages/Feed.tsx";
import CheckUserAuth from "./components/CheckUserAuth.tsx";

import EditProfilePage from "./pages/EditProfile.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/post/create",
    element: <CreatePost />,
  },
  {
    path: "feed",
    element: <Feed />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "profile/edit",
    element: <EditProfilePage />,
  },
]);

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
        <CheckUserAuth />
      </QueryClientProvider>
    </>
  );
};

export default App;
