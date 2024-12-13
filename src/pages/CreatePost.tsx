import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Webcam from "react-webcam";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  RotateCw,
  Loader2,
  X,
} from "lucide-react";
import { usePostOperations } from "../hooks/usePostCreation";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { PostData } from "../types/post";
import { QueryClient } from "@tanstack/react-query";
interface Media {
  file?: File;
  url?: string;
  aspect_ratio?: number;
}

interface MediaItemProps {
  media: Media;
  index: number;
  moveMedia: (dragIndex: number, hoverIndex: number) => void;
  removeMedia: (index: number) => void;
}

interface DragItem {
  index: number;
  type: string;
}

interface CreatePostProps {
  postId?: string;
  onSuccess?: () => void;
}

const MediaItem: React.FC<MediaItemProps> = ({
  media,
  index,
  moveMedia,
  removeMedia,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<DragItem, void>({
    accept: "media",
    hover(item: DragItem) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveMedia(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "media",
    item: { index, type: "media" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative rounded-lg overflow-hidden aspect-square w-full h-32 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {media.file?.type?.startsWith("video") || media.url?.includes("video") ? (
        <video
          src={media.url || (media.file ? URL.createObjectURL(media.file) : "")}
          className="w-full h-full object-cover"
          controls
        />
      ) : (
        <img
          src={media.url || (media.file ? URL.createObjectURL(media.file) : "")}
          alt="Upload preview"
          className="w-full h-full object-cover"
        />
      )}
      <button
        onClick={() => removeMedia(index)}
        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const CreatePost: React.FC<CreatePostProps> = ({
  postId,
  onSuccess,
}) => {
  const { user } = useAuthStore();
  const userId = user?.id;
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [content, setContent] = useState<string>("");
  const [media, setMedia] = useState<Media[]>([]);
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();
  const { createEditPostMutation } = usePostOperations();
  const queryClient = new QueryClient();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newMedia: Media[] = acceptedFiles.map((file) => ({ file }));
    setMedia((prev) => [...prev, ...newMedia]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
  });

  const moveMedia = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const newMedia = [...media];
      const draggedItem = newMedia[dragIndex];
      newMedia.splice(dragIndex, 1);
      newMedia.splice(hoverIndex, 0, draggedItem);
      setMedia(newMedia);
    },
    [media]
  );

  const handleMediaRemove = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `capture-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          setMedia((prev) => [...prev, { file }]);
          setShowCamera(false);
        });
    }
  }, []);

  const handleSubmit = async () => {
    if (!userId) return;

    try {
      const postData: PostData = {
        content,
        userId,
        media: media.map((item) => {
          if (item.file) {
            return item.file;
          }
          return {
            url: item.url || "",
            aspect_ratio: item.aspect_ratio,
          };
        }),
      };

      await createEditPostMutation.mutateAsync(
        { postData },
        {
          onSuccess: () => {
            toast.success(postId ? "Post updated!" : "Post created!");
            setContent("");
            setMedia([]);
            onSuccess?.();
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            queryClient.invalidateQueries({ queryKey: ["user-posts"] });
            navigate("/feed", { replace: true });
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : "Failed to create post"
            );
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode,
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-2xl flex flex-col justify-between bg-white mx-auto p-4 min-h-screen">
        {/* Header */}
        <div>
          <div className="flex items-center p-4 border-b">
            <button className="mr-4" onClick={() => navigate(-1)}>
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold flex-1">New post</h1>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4">
            {showCamera ? (
              <div className="relative h-full">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <Button
                    type="button"
                    onClick={capturePhoto}
                    className="bg-white"
                  >
                    Capture
                  </Button>
                  <Button
                    onClick={() =>
                      setFacingMode((prev) =>
                        prev === "user" ? "environment" : "user"
                      )
                    }
                    type="button"
                    className="bg-white"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                  {media.map((item, index) => (
                    <MediaItem
                      key={index}
                      media={item}
                      index={index}
                      moveMedia={moveMedia}
                      removeMedia={handleMediaRemove}
                    />
                  ))}
                </div>

                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full p-4 border focus-visible:outline-none focus-visible:border-black focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-dashed focus:ring-offset-0 resize-none mb-4"
                  rows={6}
                />

                <div
                  {...getRootProps()}
                  className="mb-4 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <p>Drag & drop media here, or click to select</p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {!showCamera && (
            <div className="border-t p-4">
              <div className="flex flex-col justify-start gap-4 mb-4">
                <button
                  onClick={() =>
                    (
                      document.querySelector(
                        'input[type="file"]'
                      ) as HTMLInputElement
                    )?.click()
                  }
                  type="button"
                  className="text-black p-0"
                >
                  <div className="flex gap-2">
                    <ImageIcon className="h-6 w-6" />
                    <span>Choose the file</span>
                  </div>
                </button>
                <button
                  onClick={() => setShowCamera(true)}
                  className="text-black p-0"
                  type="button"
                >
                  <div className="flex gap-2">
                    <Camera className="h-6 w-6" />
                    <span>Take a photo</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={createEditPostMutation.isPending || !content.trim()}
          className="bg-black text-white rounded-full px-6 w-full"
        >
          {createEditPostMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            "CREATE"
          )}
        </Button>
      </div>
    </DndProvider>
  );
};

export default CreatePost;
