import { Link } from "react-router";
import type { Post } from "../types";

interface PostItemProps {
  post: Post;
}

export const PostItem = ({ post }: PostItemProps) => {
  return (
    <div className="relative group">
      {/* Self closing div for fancy UI effect */}
      <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-blue-500 from-50% to-green-300 blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none" />
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="w-80 h-76 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white flex flex-col p-5 overflow-hidden transition-colors duration-300 group-hover:bg-gray-800">
          {/* Header: Avatar and Title */}
          <div className="flex items-center space-x-2">
            <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl to-[#211F70] from-[#2E2BE3]" />
            <div className="flex flex-col flex-1">
              <div>{post.title}</div>
            </div>
          </div>

          {/* Image Banner */}
          <div className="mt-2 flex-1">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full rounded-[20px] object-cover max-h-[150px] mx-auto"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};
