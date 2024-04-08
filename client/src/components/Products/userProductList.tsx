import { useAuth0 } from "@auth0/auth0-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product } from "./productCard";

const UserProductList = () => {
    const { user } = useAuth0();
    const { data, isLoading } = useQuery({
        queryKey: ['userProducts', user?.id],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${user?.id}`);
            const data = await response.json();
            return data;
        }
    });

    const deleteMutation = useMutation({
        mutationKey: ['deleteProduct'],
        mutationFn: async (id: number) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            return data;
        },
    });

    const editMutation = useMutation({
        mutationKey: ['editProduct'],
        mutationFn: async (product: Product) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });
            const data = await response.json();
            return data;
        },
    });

    const handleDelete = async (id: number) => {
        await deleteMutation.mutateAsync(id);
    };

    const handleEdit = async (product: Product) => {
        await editMutation.mutateAsync(product);
    };
    
    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No data</p>;
    
    return (
        <div>
        <h1>Your Products</h1>
        <ul>
            {data.products.map((product: Product) => (
            <div key={product.id}>
                <h2>{product.name}</h2>
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
            ))}
        </ul>
        </div>
    );
};

export default UserProductList;
