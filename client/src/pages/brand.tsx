import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ProductCard from "../components/Products/productCard";

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
            <div>
                <h1>{brandQuery.data.data[0].name}</h1>
                <p>{brandQuery.data.data[0].description}</p>
                <img src={brandQuery.data.data[0].image} alt={brandQuery.data.data[0].name}/>
            </div>
            <div>
                <h2>Products</h2>
                <div className="grid grid-cols-5 gap-4 w-12/12 m-2">
                    {brandQuery.data.data[0].products.map((product: any) => (
                        <ProductCard key={product.id} product={product}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrandPage;