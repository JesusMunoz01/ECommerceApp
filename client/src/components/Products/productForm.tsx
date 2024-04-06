import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type Product = {
    name: string;
    description: string;
    price: number;
    image: string;
};

const initialProduct: Product = {
    name: "",
    description: "",
    price: 0,
    image: "",
};

const ProductForm = () => {
    const [product, setProduct] = useState<Product>(initialProduct)
    const {user, isAuthenticated} = useAuth0()
    const createProduct = useMutation({
        mutationKey: ['createProduct'],
        mutationFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.sub}`
                },
                body: JSON.stringify(product)
            });
            const data = await response.json();
            return data;
        }
    });


    return (
        <div>
            <form>
            <input type="text" placeholder="Product Name" onChange={(e) => setProduct({...product, name: e.target.value})} /> 
            <input type="text" placeholder="Product Description" onChange={(e) => setProduct({...product, description: e.target.value})} />
            <input type="text" placeholder="Product Price" onChange={(e) => setProduct({...product, price: parseInt(e.target.value)})} />
            <input type="text" placeholder="Product Image" onChange={(e) => setProduct({...product, image: e.target.value})} />
            <button type="submit">Create Product</button>
            </form>
        </div>
    );
}

export default ProductForm;