import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase/supabase-client";
import type { PostWithCommunityAndCounts } from "../types";
import { PostItem } from "./PostItem";
import { Link } from "react-router";

interface CommunityDisplayProps {
  communityName: string;
}

const fetchCommunityPosts = async (
  communityName: string
): Promise<PostWithCommunityAndCounts[]> => {
  const { data, error } = await supabase.rpc(
    "get_community_posts_with_counts",
    { community_name_param: communityName }
  );

  if (error) {
    throw new Error(error.message);
  }

  return data as PostWithCommunityAndCounts[];
};

export const CommunityDisplay = ({ communityName }: CommunityDisplayProps) => {
  const { data, error, isLoading } = useQuery<
    PostWithCommunityAndCounts[],
    Error
  >({
    queryKey: ["communityPost", communityName],
    queryFn: () => fetchCommunityPosts(communityName),
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading Community Page...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Error loading communities: {error.message}
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-5 pb-2 text-center bg-gradient-to-r from-blue-500 from-30% to-green-500 bg-clip-text text-transparent">
        {communityName}
      </h2>
      {data && data.length > 0 ? (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          {data.map((post, key) => (
            <PostItem key={key} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-8">
          <Link
            to="/create"
            className="text-lg text-gray-400 hover:text-blue-500 transition-colors"
          >
            Be the first to post in this community!
          </Link>
        </div>
      )}
    </div>
  );
};
