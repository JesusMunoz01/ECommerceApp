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

const SellPage = () => {
    const [product, setProduct] = useState<Product>(initialProduct)

    return (
        <div>
        <h1>Sell Page</h1>
        <p>Create A Product to Sell</p>
            <form>
                <input type="text" placeholder="Product Name" onChange={(e) => setProduct({...product, name: e.target.value})} /> 
                <input type="text" placeholder="Product Description" onChange={(e) => setProduct({...product, description: e.target.value})} />
                <input type="text" placeholder="Product Price" onChange={(e) => setProduct({...product, price: parseInt(e.target.value)})} />
                <input type="text" placeholder="Product Image" onChange={(e) => setProduct({...product, image: e.target.value})} />
                <button type="submit">Create Product</button>
            </form>
        </div>
    );
};

export default SellPage;