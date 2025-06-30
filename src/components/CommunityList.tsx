import { useQuery } from "@tanstack/react-query";
import type { Community } from "../types";
import { Link } from "react-router";
import { fetchCommunities } from "../api/communities";

export const CommunityList = () => {
  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading Communities</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Error loading communities: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {data?.map((community, key) => (
        <div
          key={key}
          className="border border-white/20 p-4 rounded hover:-translate-y-1 transition transform"
        >
          <Link
            to={`/community/${community.name}`}
            className="text-2xl font-bold text-blue-500 hover:underline"
          >
            {" "}
            {community.name}{" "}
          </Link>
          <p className="text-gray-400 mt-2">{community.description}</p>
        </div>
      ))}
    </div>
  );
};
