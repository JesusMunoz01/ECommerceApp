import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Product } from "./productCard";

type ProductFormProps = {
    userProduct?: Product;
    actionType: "Create" | "Update";
    onSuccessfulSubmit?: (args: any) => void;
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

const ProductForm = ({userProduct, actionType, onSuccessfulSubmit}: ProductFormProps) => {
    const [product, setProduct] = useState<Product>(userProduct ?? initialProduct);
    const {user, isAuthenticated, getAccessTokenSilently} = useAuth0()

    const queryClient = useQueryClient();

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
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({...product, ownerID: user?.sub?.split('|')[1]})
            });
            const data = await response.json();
            console.log(data)
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['userProducts', user?.sub?.split('|')[1]], (oldData: any) => {
                return { 
                    message: oldData.message, products: oldData.products.map((product: Product) => {
                        if(product.id === userProduct?.id) {
                            return {
                                ...product,
                                ...data.product
                            }
                        }
                        return product;
                    })
                }
            });
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
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

        if(onSuccessfulSubmit) onSuccessfulSubmit(null);
    }


    return (
        <div className="flex flex-col mt-2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <label htmlFor="name" className="text-lg">Product Name:</label>
                <input type="text" className="pl-1" placeholder="Enter a Product Name" name="name" value={product.name} onChange={handleChange} />
                <label htmlFor="description" className="text-lg">Product Description:</label>
                <textarea rows={5} className="pl-1" placeholder="Product Description" name="description" value={product.description} onChange={handleChange} />
                <label htmlFor="price" className="text-lg">Product Price:</label>
                <input type="number" step="0.01" className="pl-1" placeholder="Product Price" name="price" min={0} value={product.price} onChange={handleChange} />
                <label htmlFor="stock" className="text-lg">Product Stock:</label>
                <input type="number" className="pl-1" placeholder="Product Stock" name="stock" min={0} value={product.stock} onChange={handleChange} />
                <label htmlFor="discountNumber" className="text-lg">Product Discount:</label>
                <input type="number" className="pl-1" placeholder="Product Discount" name="discountNumber" min={0} value={product.discountNumber} onChange={handleChange} />
                {/* <input type="text" placeholder="Product Image" onChange={(e) => setProduct({...product, image: e.target.value})} /> */}
                <button className="w-12/12 bg-zinc-900 mt-2" type="submit">{actionType} Product</button>
            </form>
        </div>
    );
}

export default ProductForm;