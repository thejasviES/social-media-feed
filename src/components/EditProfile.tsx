import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Pencil } from "lucide-react";
import { useImageUpload } from "../hooks/useImageUpload";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { z } from "zod";
import toast from "react-hot-toast";

import { useUpdateUserProfile, useUserProfile } from "../hooks/useUserProfile";
import { Profile } from "../types/profile";
import { useNavigate } from "react-router-dom";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(160, "Bio must be less than 160 characters"),
  avatar_url: z.string().optional(),
  banner_url: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileProps {
  userID: string;
  onBack?: () => void;
}

export function EditProfile({ userID, onBack }: EditProfileProps) {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useUserProfile(userID);
  const updateProfile = useUpdateUserProfile();
  const [formValues, setFormValues] = useState<ProfileFormValues>({
    name: "",
    bio: "",
    avatar_url: "",
    banner_url: "",
  });

  console.log("formValues", formValues);
  // Update form values when profile loads
  useEffect(() => {
    console.log("profile123", profile);
    if (profile) {
      const newValues = {
        name: profile.data.full_name || "",
        bio: profile.data.bio || "",
        avatar_url: profile.data.avatar_url || "",
        banner_url: profile.data.banner_url || "",
      };
      setFormValues(newValues);
      reset(newValues);
    }
  }, [profile]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: formValues,
    values: formValues, // This ensures the form always reflects current values
  });

  // Watch form values for real-time updates
  const currentValues = watch();

  const { uploadImage: uploadAvatar, isUploading: isUploadingAvatar } =
    useImageUpload({
      bucket: "avatars",
      onSuccess: (url) => {
        setValue("avatar_url", url);
        setFormValues((prev) => ({ ...prev, avatar_url: url }));
      },
      onError: () => toast.error("Error uploading avatar"),
    });

  const { uploadImage: uploadBanner, isUploading: isUploadingBanner } =
    useImageUpload({
      bucket: "banners",
      onSuccess: (url) => {
        setValue("banner_url", url);
        setFormValues((prev) => ({ ...prev, banner_url: url }));
      },
      onError: () => toast.error("Error uploading banner"),
    });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSaving(true);

      await updateProfile.mutateAsync(
        {
          userId: userID,
          data: {
            full_name: data.name,
            bio: data.bio,
            avatar_url: data.avatar_url || "",
            banner_url: data.banner_url || "",
          },
        },
        {
          onSuccess: () => {
            toast.success("Profile updated successfully");
          },
          onError: (error) => {
            console.error("Error in onSubmit:", error);
            toast.error("Error updating profile");
          },
        }
      );
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (profileLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="relative">
          {/* Banner Image */}
          <div className="relative h-48 md:h-64 bg-muted">
            <div className="absolute inset-x-0 top-0 flex items-center gap-4 p-4 bg-background/80 z-50 text-white hover:text-black">
              <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              {/* <h1 className="text-xl font-semibold">Edit Profile</h1> */}
            </div>
            {currentValues.banner_url && (
              <img
                src={currentValues.banner_url}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="absolute right-4 top-14 p-2 rounded-full bg-background/80 backdrop-blur-sm cursor-pointer hover:bg-background/90 transition"
              onClick={() => document.getElementById("banner-upload")?.click()}
              disabled={isUploadingBanner}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <input
              type="file"
              id="banner-upload"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  uploadBanner(file);
                }
              }}
            />
          </div>

          {/* Avatar */}
          <div className="relative -mt-16 ml-4">
            <div className="relative h-32 w-32 rounded-full border-4 border-background bg-muted overflow-hidden">
              {currentValues.avatar_url && (
                <img
                  src={currentValues.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              )}
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="absolute right-0 bottom-0 p-2 rounded-full bg-background/80 backdrop-blur-sm cursor-pointer hover:bg-background/90 transition"
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
                disabled={isUploadingAvatar}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    uploadAvatar(file);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 px-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              {...register("name")}
              className="bg-background"
              defaultValue={currentValues.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <Textarea
              id="bio"
              {...register("bio")}
              className="min-h-[100px] bg-background resize-none"
              defaultValue={currentValues.bio}
            />
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="rounded-full bg-black backdrop-blur-sm border-t">
          <Button
            type="submit"
            className="w-full text-white"
            disabled={isSaving || isUploadingAvatar || isUploadingBanner}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
