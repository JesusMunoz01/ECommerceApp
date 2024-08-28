import { useParams } from "react-router-dom";
import ProductCard from "../components/Products/productCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import EditBrandForm from "../components/Brands/editBrandForm";
import { useEffect, useState } from "react";
import ProductSelectionPopup from "../components/Popups/productSelect";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserProductsQuery } from "../utils/useQueries";
import { useUser } from "../utils/userContext";

const EditBrandPage = () => {
    const { id } = useParams();
    const [actionType, setActionType] = useState<string>('add');
    const queryClient = useQueryClient();
    const { user, getAccessTokenSilently } = useAuth0();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const { userData } = useUser();
    const [brand, setBrand] = useState(userData?.brands.find(brand => brand.id === Number(id)));

    useEffect(() => {
        setBrand(userData?.brands.find(brand => brand.id === Number(id)));
    }, [userData, id]);

    const brandProductQuery = useQuery({
        queryKey: ['brands', id, 'products'],
        queryFn: async () => {
            if(!brand) throw new Error('Brand page not found');
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

    const userProducts = useUserProductsQuery(user?.sub?.split('|')[1]);

    const addProductsQuery = useMutation({
        mutationKey: ['brands','addProducts'],
        mutationFn: async (products: number[]) => {
            const token = await getAccessTokenSilently()
            const response = await fetch(`${import.meta.env.VITE_API_URL}/brands/${id}/products/${user?.sub?.split('|')[1]}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(products)
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

    const removeProductsQuery = useMutation({
        mutationKey: ['brands','removeProducts'],
        mutationFn: async (products: number[]) => {
            const token = await getAccessTokenSilently()
            const response = await fetch(`${import.meta.env.VITE_API_URL}/brands/products/${user?.sub?.split('|')[1]}`, {
                method: 'DELETE', 
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(products)
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

    const removeProducts = (products: number[]) => {
        removeProductsQuery.mutate(products);
        togglePopup();
    }

    const togglePopup = (actionType?: string) => {
        setIsPopupVisible((prev) => !prev);
        if(actionType) setActionType(actionType);
    }

    if(!userData) return <div>Loading...</div>;
    if(userData.brands.length === 0) return <div>No brands found</div>;
    if(!brand) return <div>Brand not found</div>;

    // TODO: Double check userProducts usage
    console.log(userProducts);

    return (
        <div className="flex flex-row divide-x-2 w-full overflow-auto h-full">
            {isPopupVisible && 
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
                    <ProductSelectionPopup products={actionType === 'add' ? brandProductQuery.data.products.filter((product:any) => product.brandId !== Number(id))
                        : brandProductQuery.data.products.map((product:any) => ({ id: product.id, name: product.name }))} 
                        actionType={actionType} onClose={togglePopup} onProductsAction={actionType === 'add' ? addProducts : removeProducts} />
                </div>
            }
            <EditBrandForm brandDetails={{id: Number(id)}}/>
            <div className="flex flex-col w-3/4 p-2 h-full">
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
                        <button className="w-2/12" name="addProduct" onClick={() => togglePopup('add')}>Add New Product</button>
                        <button className="w-2/12 bg-red-800" name="removeProduct" onClick={() => togglePopup('remove')}>Remove A Product</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default EditBrandPage;