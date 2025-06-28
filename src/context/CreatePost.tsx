import { useState, type ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

interface PostInput {
  title: string;
  content: string;
}

const createPost = async (post: PostInput, imageFile: File) => {
  // Clean the filename to remove invalid characters
  const cleanFileName = imageFile.name
    .replace(/[^a-zA-Z0-9.-]/g, "_") // Replace invalid chars with underscore
    .toLowerCase();

  const cleanTitle = post.title
    .replace(/[^a-zA-Z0-9]/g, "_") // Replace spaces and special chars
    .toLowerCase();

  const filePath = `${cleanTitle}-${Date.now()}-${cleanFileName}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);
  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert([{ ...post, image_url: publicUrlData.publicUrl }]);
  if (error) throw new Error(error.message);

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { mutate } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;
    mutate(
      {
        post: {
          title,
          content,
        },
        imageFile: selectedFile,
      },
      {
        onSuccess: () => {
          setTitle("");
          setContent("");
          setSelectedFile(null);

          const fileInput = document.getElementById("image") as HTMLInputElement | null;
          if (fileInput) fileInput.value = "";
        },
      }
    );
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-white/20 bg-transparent p-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          required
          rows={5}
          onChange={(e) => setContent(e.target.value)}
          className="w-full text-gray-200 border border-white/20 bg-transparent p-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="image" className="block mb-2 font-medium">
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-gray-200 border border-white/20 bg-transparent p-1 rounded file:mr-2 file:text-sm file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-100 file:text-black hover:file:bg-gray-300"
        />
      </div>
      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        Create Post
      </button>
    </form>
  );
};
