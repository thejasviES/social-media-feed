import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "../services/apiUserPosts";


export const useUserPosts = (userId: string) => {
    return useQuery({
      queryKey: ['user-posts', userId],
      queryFn: () => getUserPosts(userId),
    });
  };