import { useParams } from "react-router-dom";
import ProductCard from "../components/Products/productCard";
import { useQuery } from "@tanstack/react-query";
import EditBrandForm from "../components/Brands/editBrandForm";

type EditBrandPageProps = {
    userData: { message: string; plan: string, brands: any[]}
};

const EditBrandPage = ({userData}: EditBrandPageProps) => {
    const { id } = useParams();
    if(!userData) return <div>Loading...</div>;

    if(userData.brands.length === 0) return <div>No brands found</div>;
    const brand = userData.brands.find(brand => brand.id === Number(id));
    if(!brand) return <div>Brand not found</div>;
    const brandProductQuery = useQuery({
        queryKey: ['brands', id, 'products'],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/brands/${id}/products/${brand.brandOwner}`);
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
    
    return (
        <div className="flex flex-row">
            <EditBrandForm brandDetails={brand}/>
            <div className="flex flex-col w-3/4 m-1">
                <h1>Your Brand's Products:</h1>
                <div className="flex flex-col">
                    <h2>Product Details:</h2>
                    {brandProductQuery.isLoading && <div>Loading...</div>}
                    {brandProductQuery.isError && <div>Error: {brandProductQuery.error.message || 'Error fetching products'}</div>}
                    {brandProductQuery.data && <div className="grid grid-cols-4 gap-4 w-12/12 m-2" style={{maxHeight: "60vh"}}>
                        {brandProductQuery.data.products.map((product: any) => (
                            <ProductCard key={product.id} product={product}/>
                        ))}
                    </div>}
                    {brandProductQuery.data && brandProductQuery.data.products.length === 0 && <div>No Products Found</div>}
                    <div className="flex gap-2">
                        <button className="w-2/12">Add New Product</button>
                        <button className="w-2/12 bg-red-800">Remove A Product</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default EditBrandPage;