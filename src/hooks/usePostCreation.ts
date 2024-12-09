import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEditPost } from '../services/apiCreateEditPost';
import { PostData } from '../types/post';


export function usePostOperations() {
  const queryClient = useQueryClient();

  const createEditPostMutation = useMutation({
    mutationFn: ({ postData, postId }: { postData: PostData; postId?: string }) => 
      createEditPost(postData, postId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
  });

  return {
    createEditPostMutation,
  };
}