import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ProductCard from "../components/Products/productCard";
import { useState } from "react";
import { productFilter } from "../utils/productFilter";

const BrandPage = () => {
    const { id } = useParams();
    const [search, setSearch] = useState('');
    const brandQuery = useQuery({
        queryKey: ['brands', id],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/brands/${id}`);
            const data = await response.json();
            console.log(data);
            if (data.error) {
                throw new Error(data.error);
            }
            return data;
        },
        retry(failureCount, error) {
            if (error.message === "Brand page not found") return false;
            return failureCount < 3;
        },
    });

    if(brandQuery.isLoading) return <div>Loading...</div>;
    if (brandQuery.isError) {
        const errorMessage = brandQuery.error.message || 'Error fetching brand';
        return <h1 className="flex items-center justify-center mt-2">Error: {errorMessage}</h1>;
    }

    return (
        <div>
            <div className="flex items-center justify-center flex-row bg-slate-500 h-fit">
                { brandQuery.data.brand.image && <img src={brandQuery.data.brand.image} alt={brandQuery.data.brand.name}/> }
                <div className="flex items-center justify-center flex-col bg-slate-500 pb-2">
                    <h1>{brandQuery.data.brand.name}</h1>
                    <p>{brandQuery.data.brand.description}</p>
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <h2 className="m-2 text-3xl p-1">Brand's Products:</h2>
                    <search className="border border-white w-fit m-2">
                        <input type="text" className="p-1 w-64" placeholder="Search Products" onChange={(e) => setSearch(e.target.value.toLocaleLowerCase())}/>
                    </search>
                </div>
                <div className="grid grid-cols-5 gap-4 w-12/12 m-2">
                    {productFilter(brandQuery.data.products, search).map((product: any) => (
                        <ProductCard key={product.id} product={product} addToCart={() => {}}/>
                    ))}
                    {productFilter(brandQuery.data.products, search).length === 0 && <div>No Products Found</div>}
                </div>
            </div>
        </div>
    );
};

export default BrandPage;