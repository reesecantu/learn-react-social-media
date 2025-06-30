import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase/supabase-client";
import type { Post } from "../types";
import { LikeButton } from "./LikeButton";

interface PostDetailsProps {
  postId: number;
}

const fetchPostById = async (postId: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const PostDetails = ({ postId }: PostDetailsProps) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId], // It's important to pass the id into the query so that each one is separated
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) {
    return <div> Loading post...</div>;
  }

  if (error) {
    return <div className="text-red-500"> Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4 mx-10">
      <h2 className="text-3xl font-bold mb-6 text-left ">
        {data?.title}
      </h2>
    {data?.image_url && (
      <img
        src={data.image_url}
        alt={data?.title}
        className="mt-4 rounded-2xl object-cover w-full border-2 border-white/20 max-h-[450px] h-auto"
      />
    )}
      <p className="text-gray-400">{data?.content}</p>
      <p className="text-gray-500 text-sm">
        Posted on: {new Date(data!.created_at).toLocaleDateString()}
      </p>

      <LikeButton postId={postId} />
    </div>
  );
};
