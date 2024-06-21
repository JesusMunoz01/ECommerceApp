import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "./productCard";
import { useState, useRef, useEffect } from "react";
import ProductForm from "./productForm";
import { productFilter } from "../../utils/productFilter";
import { useUserProductsQuery } from "../../utils/useQueries";

const UserProductList = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [filter, setFilter] = useState<string>('');
    const formRefs = useRef<{ [key: number]: React.RefObject<HTMLDivElement> | null }>({});
    const queryClient = useQueryClient();
    const { data, isLoading } = useUserProductsQuery(user?.sub?.split('|')[1]);

    useEffect(() => {
        if (editingProductId !== null && formRefs.current[editingProductId]?.current) {
            formRefs.current[editingProductId]?.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [editingProductId, formRefs]);

    const deleteMutation = useMutation({
        mutationKey: ['deleteProduct'],
        mutationFn: async (id: number) => {
            const token = await getAccessTokenSilently()
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}/${user?.sub}`, {
                method: 'DELETE',  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            return data;
        },
        onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['userProducts', user?.sub?.split('|')[1]]
                });
        }
    });

    const handleEditChange = (id: number) => {
        if (editingProductId === id) 
            setEditingProductId(null);
        else
            setEditingProductId(id);
    }

    const handleDelete = async (id: number) => {
        await deleteMutation.mutateAsync(id);
    };
    
    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No Products Found</p>;
    
    return (
        <div>
            <input type="text" placeholder="Filter Products" className="border border-slate-600 p-1 mb-2 w-2/4" onChange={(e) => setFilter(e.target.value)} />
            <div className="border border-slate-500 p-1" style={{maxHeight: "60vh"}}>
                <ul className="flex flex-col gap-4 w-10/12 overflow-y-auto">
                    {productFilter(data.products, filter).map((product: Product) => (
                    <div key={product.id} className="flex flex-col border border-slate-600 gap-2 p-2">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl">{product.name}</h2>
                            <p className="text-lg">{product.description}</p>
                            <p className="text-lg">${product.price}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-2/12" onClick={() => handleEditChange(product.id)}>Edit</button>
                            <button className="w-2/12" onClick={() => handleDelete(product.id)}>Delete</button>
                        </div>
                        <div ref={(ref) => { formRefs.current[product.id] = ref ? { current: ref } : null; }}>
                            {editingProductId === product.id && (
                                <div className="flex flex-col border-t mt-2">
                                    <h1>Edit Product</h1>
                                    <ProductForm actionType="Update" userProduct={product} onSuccessfulSubmit={setEditingProductId} />
                                </div>
                            )}
                        </div>
                    </div>
                    ))}
                    {productFilter(data.products, filter).length === 0 && <div>No Products Found</div>}
                </ul>
            </div>
        </div>
    );
};

export default UserProductList;
