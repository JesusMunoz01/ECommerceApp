import { useEffect, useState } from "react";
import ProductCard, { Product } from "../components/Products/productCard";
import { useQuery } from "@tanstack/react-query";
import { CartItem } from "./cart";

type HomePageProps = {
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    products: Product[]
};

const HomePage = ({setCart, products}: HomePageProps) => {

    const addToCart = (cartProduct: CartItem) => {
        setCart((prevCart) => [...prevCart, cartProduct]);
    };

    return (
        <div className="flex justify-center items-center flex-col w-full gap-2 md:gap-0">
            <h1 className="h-16 mt-2 text-4xl md:text-5xl">Products</h1>
            <div className="flex justify-center items-center flex-col w-full">
                <h2 className="h-12">Featured Products</h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-12/12 m-2">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} addToCart={addToCart}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;