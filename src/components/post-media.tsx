import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { cn } from "../lib/utils";
import { type Media } from "../types/feed";
import { useVideoAutoplay } from "../hooks/use-video-autoplay";

interface PostMediaProps {
  media: Media[];
}

export function PostMedia({ media }: PostMediaProps) {
  const videoRef = useVideoAutoplay();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const hasMoreThanFive = media.length > 5;

  const getGridClassName = (count: number) => {
    switch (count) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-2";
      case 4:
        return "grid-cols-2";
      default:
        return "grid-cols-3";
    }
  };

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/);
  };

  return (
    <div className="relative mt-3 overflow-hidden rounded-xl">
      <div className={cn("grid gap-0.5", getGridClassName(media.length))}>
        {media.slice(0, 5).map((item, index) => {
          const isLast = index === 4 && hasMoreThanFive;
          const showMore = media.length - 5;

          return (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <div
                  className={cn(
                    "relative aspect-square cursor-pointer overflow-hidden",
                    {
                      "row-span-2": index === 0 && media.length === 3,
                      "col-span-2": media.length === 1,
                      "aspect-[1.78]": item.aspect_ratio > 1.6,
                      "aspect-square": item.aspect_ratio <= 1.6,
                    }
                  )}
                  onClick={() => setSelectedIndex(index)}
                >
                  {isVideo(item.url) ? (
                    <video
                      ref={videoRef}
                      src={item.url}
                      className="h-full w-full object-cover"
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                  {isLast && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-2xl font-bold text-white">
                      +{showMore} more
                    </div>
                  )}
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <div className="relative aspect-[16/9]">
                  {isVideo(item.url) ? (
                    <video
                      src={item.url}
                      className="h-full w-full object-contain"
                      controls
                      autoPlay
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
}
