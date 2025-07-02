import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase/supabase-client";
import type { Post } from "../types";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { Link } from "react-router";

interface PostDetailsProps {
  postId: number;
}

interface PostWithCommunity extends Post {
  communities?: {
    name: string;
  };
}

const fetchPostById = async (postId: number): Promise<PostWithCommunity> => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      communities (
        name
      )
    `
    )
    .eq("id", postId)
    .single();

  if (error) throw new Error(error.message);

  // Ensure communities is undefined instead of null
  return {
    ...data,
    communities: data.communities === null ? undefined : data.communities,
  };
};

export const PostDetails = ({ postId }: PostDetailsProps) => {
  const { data, error, isLoading } = useQuery<PostWithCommunity, Error>({
    queryKey: ["post", postId],
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
      {/* Community Name */}
      {data?.communities?.name && (
        <div className="inline-flex items-center space-x-1 mb-2">
          <span className="text-white text-sm font-medium">from</span>
          <Link
            to={`/community/${data.communities.name}`}
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
          >
            {data.communities.name}
          </Link>
        </div>
      )}

      <h2 className="text-3xl font-bold mb-6 text-left">{data?.title}</h2>

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
      <CommentSection postId={postId} />
    </div>
  );
};
