import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { PublicViewPost } from "../components/PublicViewPost";
import { getPostById } from "../services/apiGetPost";
import { Post as PostType } from "../types/feed";

const Post = () => {
  const params = useParams();

  const { data } = useQuery<PostType>({
    queryKey: ["post", params.postId],
    queryFn: () => getPostById(params.postId!),
    enabled: !!params.postId,
  });

  return <div>{data ? <PublicViewPost post={data} /> : <Loading />}</div>;
};

export default Post;
