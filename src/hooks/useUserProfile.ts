import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "../services/apiUserProfile";
import { Profile } from "../types/profile";

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getUserProfile(userId),
  });
}

type UpdateProfileData = Omit<Profile, 'id' | 'created_at'>;

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateProfileData }) =>
      updateUserProfile(userId, data as Profile),
  });
}