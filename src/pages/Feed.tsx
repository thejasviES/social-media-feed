"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import CreatePostButton from "../components/CreatePostButton";
import { Post } from "../components/post";
import ShareModal from "../components/ShareModel";
import { Spinner } from "../components/spinner";
import UserWelcome from "../components/UserWelcome";
import { fetchFeedPosts } from "../services/apiFeed";
import { useAuthStore } from "../store/authStore";

export default function Feed() {
  const { ref, inView } = useInView();
  const { user } = useAuthStore();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [sharePostId, setSharePostId] = useState("");
  const [domainInfo, setDomainInfo] = useState("");
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
      fetchFeedPosts({ cursor: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });

  useEffect(() => {
    const getDomain = () => window.location.hostname;

    setDomainInfo(getDomain());
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading)
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
    <div className="max-w-2xl mx-auto bg-white p-4 relative min-h-screen ">
      {/* Welcome Header */}
      <UserWelcome userId={user?.id || ""} />
      <h1 className="text-[24px] font-bold  mt-4 mb-4">Feeds</h1>
      {/* Feed Content */}
      <div className="space-y-4 ">
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.data.map((post) => (
              <Post
                key={post.id}
                post={post}
                setIsShareOpen={setIsShareOpen}
                setSharePostId={setSharePostId}
              />
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
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={`https://${domainInfo}/post/${sharePostId}`}
        title={"thejasvi"}
      />
      <CreatePostButton />
    </div>
  );
}
