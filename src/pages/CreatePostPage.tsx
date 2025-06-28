import { CreatePost } from "../context/CreatePost";

export const CreatePostPage = () => {
  return (
    <div className="pt-20">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 from-30% to-green-500 bg-clip-text text-transparent">Create New Post</h2>
      <CreatePost />
    </div>
  );
};
