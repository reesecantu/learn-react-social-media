import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InsertComment, PostComment } from "../types";
import { supabase } from "../../supabase/supabase-client";
import { CommentItem } from "./CommentItem";

interface CommentSectionProps {
  postId: number;
}
const fetchComments = async (postId: number): Promise<PostComment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

const createComment = async (
  commentData: Omit<InsertComment, "user_id" | "author">,
  userId?: string,
  author?: string
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

  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<PostComment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 5000,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: Omit<InsertComment, "user_id" | "author">) => {
      return createComment(newComment, user?.id, user?.user_metadata.name);
    },
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: []})
    }
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newCommentText) return;

    mutate({
      content: newCommentText,
      parent_comment_id: null,
      post_id: postId,
    });

    setNewCommentText("");
  };


  const buildCommentTree = (
    flatComments: PostComment[]
  ): (PostComment & { children?: PostComment[] })[] => {
    // map from Comment ID -> comment and its children
    const map = new Map<number, PostComment & { children?: PostComment[] }>();
    
    // an array of parent comments with children
    const roots: (PostComment & { children?: PostComment[] })[] = [];

    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          // When adding a child to its parent's children array, we use map.get(comment.id) instead of pushing 
          // the original comment object. This ensures we are pushing the enriched comment object (with its own 
          // children property) rather than the original flat comment, preserving the nested structure as the 
          // tree is built.
          parent.children!.push(map.get(comment.id)!);
        }
      } else {
        roots.push(map.get(comment.id)!)
      }
    });
    return roots;
  };

  if (isLoading) {
    return <div> Loading comments...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold mb-4"> Comments </h3>

      {/* Create Comment Form */}

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
          <button
            type="submit"
            disabled={!newCommentText}
            className="mt-2 bg-blue-500 text-white px-3 py-2 rounded cursor-pointer"
          >
            {isPending ? "Posting..." : "Post Comment"}
          </button>
          {isError && (
            <p className="text-red-500 mt-2">Error posting comment</p>
          )}
        </form>
      ) : (
        <p className="mb-4 text-gray-400">
          must be logged in to post comments{" "}
        </p>
      )}

      {/* Comment Display Section */}

      <div className="space-y-4">
        {commentTree.map((comment, key) => (
          <CommentItem key={key} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};
