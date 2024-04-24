import { useAuth0 } from "@auth0/auth0-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product } from "./productCard";
import { useState } from "react";
import EditForm from "./editForm";

const UserProductList = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [toggleEdit, setToggleEdit] = useState(false);
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

    const handleDelete = async (id: number) => {
        await deleteMutation.mutateAsync(id);
    };

    const handleEdit = async (product: Product) => {
        setToggleEdit(!toggleEdit);
        await editMutation.mutateAsync(product);
    };
    
    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No Products Found</p>;
    
    return (
        <div>
        <ul className="flex flex-col gap-2 w-fit">
            {data.products.map((product: Product) => (
            <div key={product.id} className="flex flex-col border border-slate-600 gap-2 p-2">
                <div>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>{product.price}</p>
                </div>
                <div className="flex gap-2">
                    <button className="w-2/12" onClick={() => handleEdit(product)}>Edit</button>
                    <button className="w-2/12" onClick={() => handleDelete(product.id)}>Delete</button>
                </div>
                {toggleEdit && (
                    <EditForm product={product} />
                )}
            </div>
            ))}
        </ul>
        </div>
    );
};

export default UserProductList;
