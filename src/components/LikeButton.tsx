import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase/supabase-client";
import { useAuth } from "../context/AuthContext";
import type { Vote } from "../types";

interface LikeButtonProps {
  postId: number;
}

const vote = async (voteValue: number, postId: number, userId: string) => {
  //   Before casting vote, check to see if this post has already been voted on
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle(); // maybesingle means 1 or 0 are expected

  if (existingVote) {
    // if existing is that same as new, set vote to 0
    if (existingVote.vote === voteValue) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
      // otherwise, update the vote to new value
    } else {
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    }
  } else {
    //   cast new vote
    const { error } = await supabase
      .from("votes")
      .insert({ vote: voteValue, post_id: postId, user_id: userId });

    if (error) throw new Error(error.message);
  }
};

const fetchVotes = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);
  return data as Vote[];
};
////////////////////////////////////////////////
//////////////// MAIN COMPONENT ////////////////
////////////////////////////////////////////////

export const LikeButton = ({ postId }: LikeButtonProps) => {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const { data: votes, error, isLoading } = useQuery({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),

    refetchInterval: 5000,
  });

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You must be logged in to vote on a post");
      return vote(voteValue, postId, user.id);
    },
    onSuccess: () => {
      // Refetch votes from database to get updated count
      queryClient.invalidateQueries({ queryKey: ["votes", postId] });
    },
  });

  if (isLoading) {
    return <div> Loading votes...</div>;
  }

  if (error) {
    return <div className="text-red-500"> Error: {error.message}</div>;
  }

  const totalVotes =
    votes?.reduce((sum, vote) => sum + (vote.vote || 0), 0) ?? 0;

  const userVote = votes?.find((v) => v.user_id === user?.id)?.vote;

  return (
    <div className="flex items-center space-x-2 my-4">
      <button
        className={`p-2 rounded-full transition-colors ${
          userVote === 1
            ? "text-green-500 hover:text-green-400"
            : "text-gray-400 hover:text-gray-300 "
        }`}
        onClick={() => mutate(1)}
      >
        {/* thumbs up svg */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
      </button>
      <button
        className={`p-2 rounded-full transition-colors ${
          userVote === -1
            ? "text-red-500 hover:text-red-400"
            : "text-gray-400 hover:text-gray-300"
        }`}
        onClick={() => mutate(-1)}
      >
        {/* thumbs down svg */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="rotate-180"
        >
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
      </button>
      <p className="text-gray-300">{totalVotes}</p>
    </div>
  );
};
