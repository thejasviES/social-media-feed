import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Heart, Share } from "lucide-react";

import { formatRelativeTime } from "../utils/format-time";
import { type Post } from "../types/feed";
import { PostMedia } from "./post-media";

interface PostProps {
  post: Post;
}

export function Post({ post }: PostProps) {
  return (
    <Card className="w-full max-w-2xl">
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
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" className="gap-2">
          <Heart className="h-4 w-4" />
          <span>67</span>
        </Button>
        <Button variant="ghost" size="sm">
          <Share className="h-4 w-4" />
          <span className="ml-2">Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
