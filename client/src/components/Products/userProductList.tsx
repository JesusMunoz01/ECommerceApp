import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "./productCard";

const UserProductList = () => {
    const { user } = useAuth0();
    const { data, isLoading } = useQuery({
        queryKey: ['userProducts', user?.id],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${user?.id}`);
            const data = await response.json();
            return data;
        }
    });
    
    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No data</p>;
    
    return (
        <div>
        <h1>Your Products</h1>
        <ul>
            {data.products.map((product: Product) => (
            <li key={product.id}>{product.name}</li>
            ))}
        </ul>
        </div>
    );
};

export default UserProductList;
