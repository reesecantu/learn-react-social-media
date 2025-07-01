import { useState, type ChangeEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase/supabase-client";
import type { Community, Post, PostInsert } from "../types";
import { useAuth } from "../context/AuthContext";
import { fetchCommunities } from "../api/communities";

const createPost = async (
  post: Omit<PostInsert, "image_url">,
  imageFile: File
): Promise<Post[]> => {
  // Clean the filename to replace invalid characters with _
  const cleanFileName = imageFile.name
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .toLowerCase();

  const cleanTitle = post.title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();

  const filePath = `${cleanTitle}-${Date.now()}-${cleanFileName}`;

  // Upload image
  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);
  if (uploadError) throw new Error(uploadError.message);

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  // Insert post
  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        ...post,
        image_url: publicUrlData.publicUrl,
        avatar_url: post.avatar_url,
      },
    ])
    .select();

  if (error) throw new Error(error.message);

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [communityId, setCommunityId] = useState<number | null>(null);

  const { user } = useAuth();

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: {
      post: Omit<PostInsert, "image_url">;
      imageFile: File;
    }) => {
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
          avatar_url: user?.user_metadata.avatar_url || null,
          community_id: communityId,
        },
        imageFile: selectedFile,
      },
      {
        onSuccess: () => {
          setTitle("");
          setContent("");
          setSelectedFile(null);

          const fileInput = document.getElementById(
            "image"
          ) as HTMLInputElement | null;
          if (fileInput) fileInput.value = "";
        },
      }
    );
  };

  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setCommunityId(value ? Number(value) : null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div>
      {!user && (
        <div className="max-w-2xl mx-auto text-center text-gray-400 m-8 p-4 border border-white/20 rounded bg-white/10">
          Log in to create a post
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
        {/* POST TITLE */}
        <div>
          <label htmlFor="title" className="block mb-2 font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            required
            maxLength={50}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-white/20 bg-transparent p-2 rounded"
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {title.length}/50
          </div>
        </div>
        {/* POST CONTENT */}
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
        {/* SELECT COMMUNITY */}
        <div>
          <label htmlFor="community" className="block mb-2 font-medium">
            {" "}
            Select Community{" "}
          </label>
          <select
            id="community"
            onChange={handleCommunityChange}
            className="w-full border border-white/20 bg-transparent text-gray-200 p-2 rounded appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={""} className="bg-gray-800 text-gray-200">
              {" "}
              -- Choose a Community --{" "}
            </option>
            {communities?.map((community, key) => (
              <option
                key={key}
                value={community.id}
                className="bg-gray-800 text-gray-200"
              >
                {community.name}
              </option>
            ))}
          </select>
        </div>
        {/* UPLOAD IMAGE */}
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
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          {isPending ? "Creating..." : "Create Post"}
        </button>
        {isError && <p className="text-red-500">Error creating post.</p>}
      </form>
    </div>
  );
};
