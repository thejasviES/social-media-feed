import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Profile from "./pages/Profile.tsx";
import { SignIn } from "./pages/SignIn.tsx";
import { SignUp } from "./pages/SignUp.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { Toaster } from "react-hot-toast";
import { CreatePost } from "./pages/CreatePost.tsx";
import Feed from "./pages/Feed.tsx";
import CheckUserAuth from "./components/CheckUserAuth.tsx";

import EditProfilePage from "./pages/EditProfile.tsx";
import Post from "./pages/Post.tsx";
import ClientError from "./components/ClientError.tsx";
import PageNotFound from "./components/PageNotFound.tsx";

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
    element: <Navigate to="/feed" replace />,
    errorElement: <PageNotFound />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
    errorElement: <ClientError />,
  },
  {
    path: "/signin",
    element: <SignIn />,
    errorElement: <ClientError />,
  },
  {
    path: "/signup",
    element: <SignUp />,
    errorElement: <ClientError />,
  },
  {
    path: "/post/create",
    element: (
      <ProtectedRoute>
        <CreatePost />
      </ProtectedRoute>
    ),
    errorElement: <ClientError />,
  },
  {
    path: "feed",
    element: (
      <ProtectedRoute>
        <Feed />
      </ProtectedRoute>
    ),
    errorElement: <ClientError />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
    errorElement: <ClientError />,
  },
  {
    path: "profile/edit",
    element: (
      <ProtectedRoute>
        <EditProfilePage />
      </ProtectedRoute>
    ),
    errorElement: <ClientError />,
  },
  {
    path: "post/:postId",
    element: <Post />,
    errorElement: <ClientError />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

const App = () => {
  return (
    <main className="bg-[#FAF9F6] min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <CheckUserAuth />
      </QueryClientProvider>
    </main>
  );
};

export default App;
