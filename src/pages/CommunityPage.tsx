import { useNavigate, useParams } from "react-router";
import { CommunityDisplay } from "../components/CommunityDisplay";
import { useEffect } from "react";

export const CommunityPage = () => {
  const { name } = useParams<{ name: string }>();

  const navigate = useNavigate();

  useEffect(() => {
    if (!name) {
      navigate("/communities");
    }
  }, [name, navigate]);

  if (!name) return null;

  return (
    <div className="pt-20">
      <CommunityDisplay communityName={name} />
    </div>
  );
};
