import { Link } from "react-router";
import type { PostWithCounts } from "../types";

interface PostItemProps {
  post: PostWithCounts;
}

export const PostItem = ({ post }: PostItemProps) => {
  return (
    <div className="relative group">
      {/* Self closing div for fancy UI effect */}
      <div className="absolute -inset-1 rounded-[15px] bg-gradient-to-r from-blue-500 from-50% to-green-300 blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none" />
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="w-80 h-76 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white flex flex-col p-5 overflow-hidden transition-colors duration-300 group-hover:bg-gray-800">
          {/* Header: Avatar and Title */}
          <div className="flex items-center space-x-2">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="user avatar"
                className="w-[35px] h-[35px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl to-[#211F70] from-[#2E2BE3]" />
            )}
            <div className="flex flex-col flex-1">
              <div className="font-bold">{post.title}</div>
            </div>
          </div>

          {/* Post Image */}
          <div className="mt-2 flex-1">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full rounded-[15px] object-cover max-h-[175px] min-h-[75px] mx-auto"
            />
          </div>

          {/* Like and Comment Counts */}
          <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
            <div className="flex space-x-4">
              
                {/* sum of votes */}
                <span className="flex items-center space-x-1">
                  <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={post.like_count < 0 ? "rotate-180 transition-transform duration-200" : "transition-transform duration-200"}
                  >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                  <span>{post.like_count}</span>
                </span>

              {/* # of comments */}
              <span className="flex items-center space-x-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15c0 1.1-.9 2-2 2H7l-4 4V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v10z"/>
                </svg>
                <span>{post.comment_count}</span>
              </span>
            </div>
            <span className="text-xs">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
