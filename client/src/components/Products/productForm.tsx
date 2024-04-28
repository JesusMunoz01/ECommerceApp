import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Product } from "./productCard";

type ProductFormProps = {
    userProduct?: Product;
    actionType: "Create" | "Update";
};

const initialProduct: Product = {
    id: 0,
    name: "",
    description: "",
    price: 0,
    stock: 0,
    discountNumber: 0,
    //image: "",
};

const ProductForm = ({userProduct, actionType}: ProductFormProps) => {
    const [product, setProduct] = useState<Product>(userProduct ?? initialProduct);
    const {user, isAuthenticated, getAccessTokenSilently} = useAuth0()

    const createProduct = useMutation({
        mutationKey: ['createProduct'],
        mutationFn: async () => {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/create`, {
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

    const updateProduct = useMutation({
        mutationKey: ['updateProduct'],
        mutationFn: async () => {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${userProduct?.id}`, {
                method: 'PUT',
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!isAuthenticated) return;

        switch(actionType){
            case "Create":
                createProduct.mutate();
                break;
            case "Update":
                updateProduct.mutate();
                break;
        }
    }


    return (
        <div className="flex flex-col border border-slate-500 p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <label htmlFor="name">Product Name:</label>
                <input type="text" placeholder="Enter a Product Name" name="name" value={product.name} onChange={handleChange} />
                <input type="text" placeholder="Product Description" name="description" value={product.description} onChange={handleChange} />
                <input type="number" placeholder="Product Price" name="price" min={0} value={product.price} onChange={handleChange} />
                <input type="number" placeholder="Product Stock" name="stock" min={0} value={product.stock} onChange={handleChange} />
                <input type="number" placeholder="Product Discount" name="discountNumber" min={0} value={product.discountNumber} onChange={handleChange} />
                {/* <input type="text" placeholder="Product Image" onChange={(e) => setProduct({...product, image: e.target.value})} /> */}
                <button type="submit">{actionType} Product</button>
            </form>
        </div>
    );
}

export default ProductForm;