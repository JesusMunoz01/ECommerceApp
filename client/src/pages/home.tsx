import { useEffect } from "react";
import ProductCard from "../components/Products/productCard";
import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
    // Fetch db data using react-query
    const productQuery = useQuery({
        queryKey: ['products'], 
        queryFn: async (obj) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
            const data = await response.json();
            console.log(obj)
            console.log(data);
            return data;
        }});
    useEffect(() => {
        console.log(productQuery);
    }, [productQuery]);

    return (
        <div className="flex justify-center items-center flex-col w-full">
            <div className="mt-2">
                <h1>Home Page</h1>
            </div>
            <div className="flex justify-center items-center flex-col w-full">
                <h2>Featured Products</h2>
                <div className="grid grid-cols-5 gap-4 w-full">
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                </div>
            </div>
        </div>
    );
};

export default HomePage;