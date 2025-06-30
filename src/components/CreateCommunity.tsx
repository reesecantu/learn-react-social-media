import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { InsertCommunity } from "../types";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../supabase/supabase-client";
import { useNavigate } from "react-router";


const createCommunity = async (community: Omit<InsertCommunity, "user_id">, userId?: string ) => {
     if (!userId) {
    throw new Error("You must be logged in to comment and have a username");
  }
  const { error } = await supabase
  .from("communities")
  .insert({
      name: community.name,
      description: community.description,
      user_id: userId,
    });
  
    if (error) throw new Error(error.message);
}

const checkCommunityExists = async (name: string) => {
  const { data, error } = await supabase
    .from("communities")
    .select("id")
    .eq("name", name)
    .single();

  if (error) throw new Error(error.message);
  return data !== null;
}


export const CreateCommunity = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  // Check community existence with React Query
  const { data: communityExists } = useQuery({
    queryKey: ["checkCommunity", name],
    queryFn: () => checkCommunityExists(name),
    enabled: name.length >= 3, // Only run query when name is long enough
    staleTime: 30000, // Cache for 30 seconds
  });

  // Validate community name
  const validateName = (value: string) => {
    const validPattern = /^[a-zA-Z0-9_]+$/; // Only letters, numbers, and underscores
    if (!validPattern.test(value)) {
      setNameError("Community name can only contain letters, numbers, and underscores");
      return false;
    }
    if (value.length < 3) {
      setNameError("Community name must be at least 3 characters");
      return false;
    }
    if (value.length > 40) {
      setNameError("Community name must be 40 characters or less");
      return false;
    }
    if (communityExists) {
      setNameError("A community with this name already exists");
      return false;
    }

    setNameError("");
    return true;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value) validateName(value);
  };

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newCommunity: Omit<InsertCommunity, "user_id">) => {
      return createCommunity(newCommunity, user?.id);
    },
    onSuccess: (_data, variables) => {
      navigate(`/community/${encodeURIComponent(variables.name)}`);
      setName("");
      setDescription("");
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateName(name)) return;
    mutate({
      name,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label htmlFor="name" className="block mb-2 font-medium"> Community Name </label>
        <input
          type="text"
          id="name"
          required
          pattern="[a-zA-Z0-9_]+"
          minLength={3}
          maxLength={40}
          onChange={handleNameChange}
          value={name}
          className="w-full border border-white/20 bg-transparent p-2 rounded"
          placeholder="e.g. ReactDevelopers"
        />
        {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
        <div className="flex justify-between items-center mt-1">
          <p className="text-gray-400 text-xs">Only letters, numbers, and underscores allowed</p>
          <div className="text-right text-xs text-gray-400">
            {name.length}/40
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="description" className="block mb-2 font-medium"> Description </label>
        <textarea
          id="description"
          required
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full text-gray-200 border border-white/20 bg-transparent p-2 rounded"
        />
      </div>
      <button 
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? "Creating..." : "Create Community"}
      </button>

      {isError && <p className="text-red-500">Error Creating Community</p> }
    </form>
  );
};
