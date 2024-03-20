import { useEffect, useState } from "react";
import ProductCard, { Product } from "../components/Products/productCard";
import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const productQuery = useQuery({
        queryKey: ['products'], 
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
            const data = await response.json();
            return data;
        }});

    useEffect(() => {
        if(productQuery.isSuccess) {
            setProducts(productQuery.data.products);
        }
    }, [productQuery]);

    if(productQuery.isLoading) return <div>Loading...</div>;
    if(productQuery.isError) return <div>Error fetching products</div>;

    return (
        <div className="flex justify-center items-center flex-col w-full">
            <div className="mt-2">
                <h1>Home Page</h1>
            </div>
            <div className="flex justify-center items-center flex-col w-full">
                <h2>Featured Products</h2>
                <div className="grid grid-cols-5 gap-4 w-full">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;