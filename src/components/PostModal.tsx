import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";

const PostModal = ({
  post,
  isOpen,
  onClose,
}: {
  post: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  const isVideo = (url: string) => url?.match(/\.(mp4|webm|ogg)$/);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === post.media.length - 1 ? prev : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? prev : prev - 1));
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center ">
      <div className="absolute top-4 right-4">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="w-full max-w-3xl mx-4">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-black">
          {isVideo(post.media[currentIndex]?.url) ? (
            <video
              src={post.media[currentIndex]?.url}
              className="w-full h-full object-contain"
              controls
              autoPlay
              loop
              muted
            />
          ) : (
            <img
              src={post.media[currentIndex]?.url}
              alt=""
              className="w-full h-full object-contain"
            />
          )}

          {post.media.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentIndex === post.media.length - 1}
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                {post.media.map((_: any, index: number) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostModal;
