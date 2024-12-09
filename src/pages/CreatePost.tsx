import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Webcam from "react-webcam";

import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { X, Camera, Image as ImageIcon, RotateCw, Loader2 } from "lucide-react";
import { usePostOperations } from "../hooks/usePostCreation";
import { PostData } from "../types/post";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

interface MediaItemProps {
  media: { file?: File; url?: string };
  index: number;
  moveMedia: (dragIndex: number, hoverIndex: number) => void;
  removeMedia: (index: number) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({
  media,
  index,
  moveMedia,
  removeMedia,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "media",
    hover(item: { index: number }, monitor) {
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
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const isVideo =
    media.file?.type.startsWith("video") || media.url?.includes("video");

  return (
    <div
      ref={ref}
      className={`relative rounded-lg overflow-hidden h-32 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {isVideo ? (
        <video
          src={media.url || URL.createObjectURL(media.file!)}
          className="w-full h-full object-cover"
          controls
        />
      ) : (
        <img
          src={media.url || URL.createObjectURL(media.file!)}
          alt="Uploaded media"
          className="w-full h-full object-cover"
        />
      )}
      <button
        onClick={() => removeMedia(index)}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const CreatePost: React.FC<{
  postId?: string;
  onSuccess?: () => void;
}> = ({ postId, onSuccess }) => {
  const { user } = useAuthStore();
  const userId = user?.id;
  console.log("user", user);
  const [showCamera, setShowCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<Array<{ file?: File; url?: string }>>([]);
  const webcamRef = useRef<Webcam>(null);

  const { createEditPostMutation } = usePostOperations();

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleMediaAdd = (newMedia: Array<{ file?: File; url?: string }>) => {
    setMedia((prev) => [...prev, ...newMedia]);
  };

  const handleMediaRemove = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMediaReorder = (
    newOrder: Array<{ file?: File; url?: string }>
  ) => {
    setMedia(newOrder);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newMedia = acceptedFiles.map((file) => ({ file }));
    handleMediaAdd(newMedia);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const moveMedia = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const newMedia = [...media];
      const draggedItem = newMedia[dragIndex];
      newMedia.splice(dragIndex, 1);
      newMedia.splice(hoverIndex, 0, draggedItem);
      handleMediaReorder(newMedia);
    },
    [media]
  );

  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      const newMedia = files.map((file) => ({ file }));
      handleMediaAdd(newMedia);
    };
    input.click();
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
          handleMediaAdd([{ file }]);
          setShowCamera(false);
        });
    }
  }, []);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // const handleSubmit = async () => {
  //   try {
  //     const postData: PostData = {
  //       content,
  //       userId,
  //       media: media.map((item) => {
  //         if (item.file) {
  //           return item.file;
  //         }
  //         return { url: item.url };
  //       }),
  //     };
  //     console.log("postData", postData);
  //     await createEditPostMutation.mutateAsync(
  //       { postData, postId },
  //       {
  //         onSuccess: () => {
  //           toast.success(
  //             postId
  //               ? "Post updated successfully!"
  //               : "Post created successfully!"
  //           );
  //           setContent("");
  //           setMedia([]);
  //           onSuccess?.();
  //         },
  //         onError: (error) => {
  //           toast.error(
  //             error instanceof Error ? error.message : "Failed to create post"
  //           );
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error in handleSubmit:", error);
  //   }
  // };
  const handleSubmit = async () => {
    try {
      const postData = {
        content,
        userId,
        // Transform media to match API expectations
        media: media.map((item) => {
          if (item.file) {
            // Return the file directly without modification
            return item.file;
          }
          // For existing media, return the URL and aspect ratio
          return {
            url: item.url,
            aspect_ratio: item.aspect_ratio,
          };
        }),
      };

      await createEditPostMutation.mutateAsync(
        { postData, postId },
        {
          onSuccess: () => {
            toast.success(
              postId
                ? "Post updated successfully!"
                : "Post created successfully!"
            );
            setContent("");
            setMedia([]);
            onSuccess?.();
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : "Failed to create post"
            );
          },
        }
      );
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode,
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 shadow-xl">
        <CardContent className="p-6">
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full mb-4 p-4 rounded-lg border-2 border-indigo-200 dark:border-indigo-800 focus:border-indigo-500 dark:focus:border-indigo-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors"
            rows={4}
          />

          {showCamera ? (
            <div className="relative mb-4">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full rounded-lg"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <Button
                  onClick={capturePhoto}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Capture
                </Button>
                <Button
                  onClick={toggleCamera}
                  variant="outline"
                  className="bg-white"
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  Flip Camera
                </Button>
                <Button
                  onClick={() => setShowCamera(false)}
                  variant="destructive"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`mb-4 p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-indigo-500 bg-indigo-100 dark:bg-indigo-900"
                  : "border-gray-300 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600"
              }`}
            >
              <input {...getInputProps()} />
              <p className="text-gray-600 dark:text-gray-400">
                Drag & drop media files here, or click to select files
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-4">
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

          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Button
                onClick={() => setShowCamera(true)}
                variant="outline"
                className="bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900"
              >
                <Camera className="mr-2 h-4 w-4" />
                Camera
              </Button>
              <Button
                onClick={handleFileUpload}
                variant="outline"
                className="bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Gallery
              </Button>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={
                createEditPostMutation.isPending || content.trim() === ""
              }
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-full transition-colors"
            >
              {createEditPostMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </div>
          {createEditPostMutation.error && (
            <p className="text-red-500 mt-2">
              {createEditPostMutation.error instanceof Error
                ? createEditPostMutation.error.message
                : "An error occurred"}
            </p>
          )}
        </CardContent>
      </Card>
    </DndProvider>
  );
};

export default CreatePost;
