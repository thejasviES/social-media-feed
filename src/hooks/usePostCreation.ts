import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEditPost } from '../services/apiCreateEditPost';
import { PostData } from '../types/post';


export function usePostOperations() {
  const queryClient = useQueryClient();

  const createEditPostMutation = useMutation({
    mutationFn: ({ postData }: { postData: PostData }) => 
      createEditPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
    },
  },

);

  return {
    createEditPostMutation,
  };
}