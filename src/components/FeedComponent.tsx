// components/Feed.tsx
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Fragment, useEffect } from "react";
import { fetchFeedPosts } from "../services/apiFeed";
import { Post } from "../types/feed";

export const FeedComponent = () => {
  const { ref, inView } = useInView();

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
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading feed</div>;

  return (
    <div className="max-w-2xl mx-auto">
      {data?.pages.map((page, i) => (
        <Fragment key={i}>
          {page.data.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Fragment>
      ))}

      {/* Loading trigger element */}
      <div ref={ref} className="h-10 flex items-center justify-center">
        {isFetchingNextPage ? (
          <Spinner />
        ) : hasNextPage ? (
          "Load more"
        ) : (
          "No more posts"
        )}
      </div>
    </div>
  );
};

// PostCard component for rendering individual posts
const PostCard = ({ post }: { post: Post }) => {
  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex items-center mb-4">
        {post.avatar && (
          <img
            src={post.avatar}
            alt={post.full_name}
            className="w-10 h-10 rounded-full mr-3"
          />
        )}
        <div>
          <div className="font-medium">{post.full_name}</div>
          <div className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <p className="mb-4">{post.content}</p>

      {post.media && post.media.length > 0 && (
        <div className="grid gap-2">
          {post.media.map((media) => (
            <img
              key={media.id}
              src={media.url}
              alt=""
              className="rounded-lg"
              style={{ aspectRatio: media.aspect_ratio }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Spinner = () => (
  <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent" />
);
