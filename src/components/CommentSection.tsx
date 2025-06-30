import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import type { InsertComment } from "../types";
import { supabase } from "../../supabase/supabase-client";

interface CommentSectionProps {
  postId: number;
}

const createComment = async (
  commentData: Omit<InsertComment, "user_id" | "author">,
  userId: string,
  author: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to comment and have a username");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: commentData.post_id,
    content: commentData.content,
    parent_comment_id: commentData.parent_comment_id || null,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const [newCommentText, setNewCommentText] = useState<string>("");

  const { user } = useAuth();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: Omit<InsertComment, "user_id" | "author">) =>
      createComment(newComment, user?.id, user?.user_metadata.name),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newCommentText) return;

    mutate({
      content: newCommentText,
      parent_comment_id: null,
      post_id: postId,
    });

    setNewCommentText("")
  };

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold mb-4"> Comments </h3>
      {user ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={newCommentText}
            name=""
            id=""
            rows={3}
            placeholder="Write a comment..."
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full border border-white/20 bg-transparent p-2 rounded"
          />
          <button type="submit" disabled={!newCommentText} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
            {isPending ? "Posting...": "Post Comment"}
          </button>
          {isError && (
            <p className="text-red-500 mt-2">Error posting comment</p>
          )}
        </form>
      ) : (
        <p className="mb-4 text-gray-400">must be logged in to post comments </p>
      )}
    </div>
  );
};
