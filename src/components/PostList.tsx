import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase/supabase-client";
import { PostItem } from "./PostItem";
import type { PostWithCounts } from "../types";

const fetchPosts = async (): Promise<PostWithCounts[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");

  if (error) throw new Error(error.message);

  return data;
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<PostWithCounts[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {data?.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};
