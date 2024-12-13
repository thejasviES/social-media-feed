import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent, CardHeader } from "../components/ui/card";

import { type Post } from "../types/feed";
import { formatRelativeTime } from "../utils/format-time";
import { PostMedia } from "./post-media";

interface PostProps {
  post: Post;
}

const getRandomLightColor = () => {
  const lightColors = [
    "bg-pink-50",
    "bg-purple-50",
    "bg-indigo-50",
    "bg-blue-50",
    "bg-green-50",
    "bg-yellow-50",
    "bg-orange-50",
    "bg-red-50",
    "bg-teal-50",
    "bg-cyan-50",
  ];

  return lightColors[Math.floor(Math.random() * lightColors.length)];
};

export function PublicViewPost({ post }: PostProps) {
  const backgroundColor = useMemo(() => getRandomLightColor(), [post.id]);

  return (
    <div className="max-w-2xl flex flex-col mx-auto bg-white p-4 relative min-h-screen item-center justify-center">
      <Card className={`w-full max-w-2xl ${backgroundColor} rounded-[26px]`}>
        <CardHeader className="flex-row items-center space-x-4 space-y-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.avatar || ""} alt={post.full_name} />
            <AvatarFallback>{post.full_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold">{post.full_name}</div>
            <div className="text-sm text-muted-foreground">
              {formatRelativeTime(post.created_at)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{post.content}</p>
          <PostMedia media={post?.media || []} />
        </CardContent>
      </Card>
    </div>
  );
}
