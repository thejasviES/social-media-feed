import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

import { useUserProfile } from "../hooks/useUserProfile";
import { useUserPosts } from "../hooks/userPost";
import { useVideoAutoplay } from "../hooks/use-video-autoplay";
import { useNavigate } from "react-router-dom";
import PostModal from "./PostModal";
import { useState } from "react";
import Loading from "./Loading";

export function ProfileComponent({ userId }: { userId: string }) {
  const videoRef = useVideoAutoplay();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useUserProfile(userId);
  const { data: posts, isLoading: postsLoading } = useUserPosts(userId);
  const [selectedPost, setSelectedPost] = useState(null);

  if (profileLoading || postsLoading) {
    return <Loading />;
  }
  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/);
  };

  return (
    <div className="bg-white rounded-lg">
      {/* Header with background image */}
      <div className="relative h-60 rounded-t-lg overflow-hidden">
        <img
          src={
            profile?.data.banner_url ||
            "https://images.unsplash.com/photo-1557683311-eac922347aa1?w=1000&h=400&fit=crop"
          }
          alt="Profile background"
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="px-6 -mt-20 relative">
        <div className="flex items-start justify-between">
          <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white">
            <img
              src={
                profile?.data.avatar_url ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}&backgroundColor=b6e3f4`
              }
              alt="Profile picture"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <h1 className="text-2xl font-bold">{profile?.data.full_name}</h1>
            <p className="mt-2 text-gray-600 max-w-sm">{profile?.data.bio}</p>
          </div>

          <Button
            variant="outline"
            className="mt-4 rounded-full px-6 hover:border-slate-300"
            onClick={() => navigate("/profile/edit")}
          >
            Edit Profile
          </Button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">My Posts</h2>
          <div className="grid grid-cols-2 gap-4 pb-20">
            {posts?.data && posts.data.length > 0 ? (
              posts.data.map((post) => (
                <div
                  key={post.id}
                  className={`relative aspect-square rounded-2xl overflow-hidden ${
                    post.media && post.media.length > 0 ? "cursor-pointer" : ""
                  }`}
                  onClick={() =>
                    post.media && post.media.length > 0
                      ? setSelectedPost(post)
                      : null
                  }
                >
                  {post.media && post.media.length > 0 ? (
                    <>
                      {isVideo(post.media[0]?.url || "") ? (
                        <video
                          ref={videoRef}
                          src={post.media[0].url}
                          className="w-full h-full object-cover"
                          loop
                          muted
                        />
                      ) : (
                        <img
                          src={post.media[0]?.url || "/api/placeholder/400/400"}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                      {post.media.length > 1 && (
                        <span className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-sm text-white">
                          {post.media.length} +
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No media</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                    </>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-medium truncate">
                      {post.content || "Untitled"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-20 text-center">
                <div className="text-gray-500 mb-2">No posts yet</div>
                <p className="text-sm text-gray-400">
                  Share your first moment with the world!
                </p>
              </div>
            )}
          </div>
        </div>

        <PostModal
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      </div>
    </div>
  );
}
