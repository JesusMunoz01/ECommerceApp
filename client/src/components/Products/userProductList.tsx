import { useAuth0 } from "@auth0/auth0-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product } from "./productCard";
import { useState } from "react";
import EditForm from "./editForm";

const UserProductList = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [filter, setFilter] = useState<string>('');
    const { data, isLoading } = useQuery({
        queryKey: ['userProducts', user?.id],
        queryFn: async () => {
            const token = await getAccessTokenSilently();
            const userId = user?.sub?.split('|')[1];
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/user/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
            const data = await response.json();
            console.log(data);
            return data;
        }
    });

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
    });

    const editMutation = useMutation({
        mutationKey: ['editProduct'],
        mutationFn: async (product: Product) => {
            const token = await getAccessTokenSilently()
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({product: product, uid: user?.sub})
            });
            const data = await response.json();
            return data;
        },
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

    const handleEdit = async (product: Product) => {
        setEditingProductId(null);
        await editMutation.mutateAsync(product);
    };
    
    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No Products Found</p>;
    
    return (
        <div>
            <input type="text" placeholder="Filter Products" className="border border-slate-600 p-1 mb-2 w-2/4" onChange={(e) => setFilter(e.target.value)} />
        <div className=" h-12/12" style={{maxHeight: "95%"}}>
        <ul className="flex flex-col gap-2 w-10/12 overflow-y-auto">
            {data.products.filter((product: Product) => product.name.toLowerCase().includes(filter.toLowerCase())).map((product: Product) => (
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
                {editingProductId === product.id && (
                    <EditForm product={product} handleEdit={handleEdit} />
                )}
            </div>
            ))}
        </ul>
        </div>
        </div>
    );
};

export default UserProductList;
