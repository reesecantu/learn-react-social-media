import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase/supabase-client";
import { PostItem } from "./PostItem";
import type { Post } from "../types";

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <div> Loading posts...</div>;
  }

  if (error) {
    return <div className="text-red-500"> Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {data?.map((post) => (
        <PostItem post={post} />
      ))}
    </div>
  );
};
