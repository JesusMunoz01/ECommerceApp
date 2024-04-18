import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type Product = {
    name: string;
    description: string;
    price: number;
    stock: number;
    discountNumber: number;
    //image: string;
};

const initialProduct: Product = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    discountNumber: 0,
    //image: "",
};

const ProductForm = () => {
    const [product, setProduct] = useState<Product>(initialProduct)
    const {user, isAuthenticated, getAccessTokenSilently} = useAuth0()

    const createProduct = useMutation({
        mutationKey: ['createProduct'],
        mutationFn: async () => {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    discountNumber: product.discountNumber,
                    ownerID: user?.sub
                })
            });
            const data = await response.json();
            return data;
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!isAuthenticated) return;
        createProduct.mutate();
    }


    return (
        <div className="flex flex-col">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input type="text" placeholder="Product Name" onChange={(e) => setProduct({...product, name: e.target.value})} /> 
                <input type="text" placeholder="Product Description" onChange={(e) => setProduct({...product, description: e.target.value})} />
                <input type="text" placeholder="Product Price" onChange={(e) => setProduct({...product, price: parseInt(e.target.value)})} />
                <input type="text" placeholder="Product Stock" onChange={(e) => setProduct({...product, stock: parseInt(e.target.value)})} />
                <input type="text" placeholder="Product Discount" onChange={(e) => setProduct({...product, discountNumber: parseInt(e.target.value)})} />
                {/* <input type="text" placeholder="Product Image" onChange={(e) => setProduct({...product, image: e.target.value})} /> */}
                <button type="submit">Create Product</button>
            </form>
        </div>
    );
}

export default ProductForm;