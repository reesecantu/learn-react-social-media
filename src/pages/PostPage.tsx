import { useParams } from "react-router";
import { PostDetails } from "../components/PostDetails";


export const PostPage = () => {
//   get the post id from the URL
    const {id} = useParams<{ id: string}>();
  
    return (
    <div className="pt-10">
        <PostDetails postId={Number(id)} />
    </div>
  );
};
