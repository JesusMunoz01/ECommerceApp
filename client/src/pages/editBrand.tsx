import { useParams } from "react-router-dom";
import ProductCard from "../components/Products/productCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import EditBrandForm from "../components/Brands/editBrandForm";
import { useEffect, useState } from "react";
import ProductSelectionPopup from "../components/Popups/productSelect";
import { useAuth0 } from "@auth0/auth0-react";

type EditBrandPageProps = {
    userData: { message: string; plan: string, brands: any[]}
};

const EditBrandPage = ({userData}: EditBrandPageProps) => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { user, getAccessTokenSilently } = useAuth0();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [brand, setBrand] = useState(userData?.brands.find(brand => brand.id === Number(id)));

    useEffect(() => {
        setBrand(userData?.brands.find(brand => brand.id === Number(id)));
    }, [userData, id]);

    const brandProductQuery = useQuery({
        queryKey: ['brands', id, 'products'],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/brands/${id}/products/${brand.brandOwner}`);
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            return data;
        },
        enabled: !!brand,
        retry(failureCount, error) {
            if (error.message === "Brand page not found") return false;
            return failureCount < 3;
        },
    });

    const userProducts = useQuery({
        queryKey: ['userProducts', user?.id],
        queryFn: async () => {
            const token = await getAccessTokenSilently();
            const userId = user?.sub?.split('|')[1];
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            return data;
        }
    });

    const addProductsQuery = useMutation({
        mutationKey: ['brands','addProducts'],
        mutationFn: async (products: number[]) => {
            const token = await getAccessTokenSilently()
            const response = await fetch(`${import.meta.env.VITE_API_URL}/brands/${id}/products/${user?.sub}`, {
                method: 'POST', 
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ products })
            });
            const data = await response.json();
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['brands', id, 'products']
            });
        }
    });

    const addProducts = (products: number[]) => {
        addProductsQuery.mutate(products);
        togglePopup();
    }

    const togglePopup = () => setIsPopupVisible(!isPopupVisible);

    if(!userData) return <div>Loading...</div>;
    if(userData.brands.length === 0) return <div>No brands found</div>;
    if(!brand) return <div>Brand not found</div>;
    
    return (
        <div className="flex flex-row">
            {isPopupVisible && 
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
                    <ProductSelectionPopup products={userProducts.data.products} onClose={togglePopup} onAddProducts={addProducts} />
                </div>
            }
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
                        <button className="w-2/12" onClick={togglePopup}>Add New Product</button>
                        <button className="w-2/12 bg-red-800">Remove A Product</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default EditBrandPage;