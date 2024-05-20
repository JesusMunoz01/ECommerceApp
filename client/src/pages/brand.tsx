import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const BrandPage = () => {
    const { id } = useParams();
    const brandQuery = useQuery({
        queryKey: ['brands', id],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/brands/${id}`);
            const data = await response.json();
            return data;
        }
    });

    if(brandQuery.isLoading) return <div>Loading...</div>;
    if(brandQuery.isError) return <div>Error fetching brand</div>;
    
    return (
        <div>
            <h1>Brand</h1>
        </div>
    );
};

export default BrandPage;