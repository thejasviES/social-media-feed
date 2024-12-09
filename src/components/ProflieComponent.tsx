import { ArrowLeft, Heart, Plus } from "lucide-react";
import { Button } from "./ui/button";

import { useUserProfile } from "../hooks/useUserProfile";
import { useUserPosts } from "../hooks/userPost";
import { useVideoAutoplay } from "../hooks/use-video-autoplay";
import { useNavigate } from "react-router-dom";

// Component
export function ProfileComponent({ userId }: { userId: string }) {
  const videoRef = useVideoAutoplay();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useUserProfile(userId);
  const { data: posts, isLoading: postsLoading } = useUserPosts(userId);

  console.log(profile);
  console.log(posts);
  if (profileLoading || postsLoading) {
    return <div>Loading...</div>;
  }
  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/);
  };

  return (
    <div className="">
      {/* Header with background image */}
      <div className="relative h-60">
        <img
          src={profile?.data.banner_url || "/api/placeholder/480/240"}
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

      {/* Profile section */}
      <div className="px-6 -mt-20 relative ">
        <div className="flex items-start justify-between">
          <div className="relative h-32 w-32  rounded-full overflow-hidden border-4 border-white">
            <img
              src={profile?.data.avatar_url || "/api/placeholder/96/96"}
              alt="Profile picture"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className=" flex justify-between items-center mt-4">
          <div>
            <h1 className="text-2xl font-bold">{profile?.data.full_name}</h1>
            <p className="mt-2 text-gray-600 max-w-sm">{profile?.data.bio}</p>
          </div>

          <Button
            variant="outline"
            className="mt-4 rounded-full px-6 hover:border-slate-300 "
            onClick={() => navigate("/profile/edit")}
          >
            Edit Profile
          </Button>
        </div>

        {/* Posts section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">My Posts</h2>
          <div className="grid grid-cols-2 gap-4 pb-20">
            {posts?.data?.map((post) => (
              <div
                key={post.id}
                className="relative aspect-square rounded-2xl overflow-hidden"
              >
                {isVideo(post.media?.[0]?.url) ? (
                  <video
                    ref={videoRef}
                    src={post.media?.[0]?.url}
                    className="h-full w-full object-cover"
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={post.media?.[0]?.url || "/api/placeholder/400/400"}
                    alt={post.content}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* <img
                  src={post.media?.[0]?.url || "/api/placeholder/400/400"}
                  alt={post.content}
                  className="w-full h-full object-cover"
                /> */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                {post.media?.length > 1 && (
                  <span className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-sm text-white">
                    1/{post.media.length}
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-medium truncate">
                    {post.content}
                  </p>
                  <div className="flex items-center mt-1">
                    <Heart className="w-4 h-4 text-white" />
                    <span className="ml-1 text-sm text-white">
                      {post.likes_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
