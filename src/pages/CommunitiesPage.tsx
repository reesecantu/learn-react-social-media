import { CommunityList } from "../components/CommunityList";


export const CommunitiesPage = () => {
  return (
    <div className="pt-20">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 from-30% to-green-500 bg-clip-text text-transparent">Communities</h2>
      <CommunityList />
    </div>
  );
};
