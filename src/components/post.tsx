import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { useMemo } from "react";

import { formatRelativeTime } from "../utils/format-time";
import { type Post } from "../types/feed";
import { PostMedia } from "./post-media";
import { Share } from "lucide-react";

interface PostProps {
  post: Post;
  setIsShareOpen: (boolean: boolean) => void;
  setSharePostId: (string: string) => void;
}

const getRandomLightColor = () => {
  // Array of light colors with high saturation and lightness
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

export function Post({ post, setIsShareOpen, setSharePostId }: PostProps) {
  // Use useMemo to keep the same color for each post instance

  const backgroundColor = useMemo(() => getRandomLightColor(), [post.id]);

  return (
    <>
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
        <CardFooter className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsShareOpen(true);
              setSharePostId(post.id);
            }}
          >
            <Share className="h-4 w-4" />
            <span className="ml-2">Share</span>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
