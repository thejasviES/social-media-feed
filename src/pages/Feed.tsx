"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchFeedPosts } from "../services/apiFeed";
import { Spinner } from "../components/spinner";
import { Post } from "../components/post";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useAuthStore } from "../store/authStore";
import { useUserProfile } from "../hooks/useUserProfile";
import { User } from "lucide-react";
import UserWelcome from "../components/UserWelcome";

export default function Feed() {
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const { user } = useAuthStore();

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) =>
      fetchFeedPosts({ cursor: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null as string | null,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading )
    return (
      <div className="flex justify-center p-4">
        <Spinner />
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 p-4">Error loading feed</div>
    );

  return (
    <div className="max-w-2xl mx-auto p-4 relative min-h-screen">
      {/* Welcome Header */}
      <UserWelcome userId={user?.id} />

      {/* Feed Content */}
      <div className="space-y-4">
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.data.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </Fragment>
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="flex justify-center p-4">
          <Spinner />
        </div>
      )}
      <div ref={ref} />

      <Link
        to="/post/create"
        className="sticky bottom-[30px] left-full bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors"
        aria-label="Create new post"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </Link>
    </div>
  );
}
