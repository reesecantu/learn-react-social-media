import { useQuery } from "@tanstack/react-query"


const fetchCommunities = async () => {
    
}


export const CommunityList = () => {
    const {} = useQuery({queryKey: ["communities"], queryFn: fetchCommunities})

}