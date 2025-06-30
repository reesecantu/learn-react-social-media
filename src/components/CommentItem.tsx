import { useState } from "react";
import type { PostComment } from "../types";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../supabase/supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CommentItemProps {
  comment: PostComment & { children?: PostComment[] };
  postId: number;
  key: number;
}

const createReply = async (
  replyContent: string,
  postId: number,
  parentCommentId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author)
    throw new Error("Must be logged in to reply to a comment");

  const { error } = await supabase.from("comments").insert({
    content: replyContent,
    post_id: postId,
    parent_comment_id: parentCommentId,
    user_id: userId,
    author: author,
  });

if (error) {
    throw new Error("Failed to create reply: " + error.message);
}
};

export const CommentItem = ({ comment, postId }: CommentItemProps) => {
  const [showReply, setShowReply] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");

  const { user } = useAuth();

  const queryClient = useQueryClient()

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) => {
      return createReply(
        replyContent,
        postId,
        comment.id,
        user?.id,
        user?.user_metadata.name
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [] });
      setReplyText("");
      setShowReply(false)
    },
  });

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) return;
    mutate(replyText);
  };

  return (
    <div className="pl-4 border-l border-white/20">
      <div className="mb-2">
        <div className="flex items-center space-x-2">
          {/* Display the commenters username */}
          <span className="text-sm font-bold text-blue-400">
            {comment.author}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        <p className="text-gray-300">{comment.content}</p>
        <button onClick={() => setShowReply((prev) => !prev)}>
          {" "}
          {showReply ? "Cancel" : "Reply"}{" "}
        </button>
      </div>

      {showReply && user && (
        <form onSubmit={handleReplySubmit} className="mb-4">
          <textarea
            value={replyText}
            name=""
            id=""
            rows={2}
            placeholder="Write a reply..."
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full border border-white/20 bg-transparent p-2 rounded"
          />
          <button
            type="submit"
            disabled={!replyText}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
          >
            {isPending ? "Posting..." : "Post Reply"}
          </button>
          {isError && <p className="text-red-500 mt-2">Error posting reply</p>}
        </form>
      )}
    </div>
  );
};
