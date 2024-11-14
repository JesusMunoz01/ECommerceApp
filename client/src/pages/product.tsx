import { useParams } from "react-router-dom"
import { Product } from "../components/Products/productCard";
import { CartItem } from "./cart";
import { useState } from "react";
import ReviewForm from "../components/Reviews/reviewForm";

type ProductPageProps = {
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    products: Product[]
}

const ProductPage = ({setCart, products}: ProductPageProps) => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const addToCart = (cartProduct: CartItem) => {
        setCart((prevCart) => [...prevCart, cartProduct]);
    };

    const product = id ? products.find(p => p.id === parseInt(id)) : null;

    if (!product) return <div>Product not found</div>;

    const addProduct = () => {
        if(addToCart){
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
            });
            setQuantity(1);
        }
    };

    return (
        <div className="flex flex-col pt-2 gap-4">
            <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2">
                    {product.stock < 3 ? <strong>Only ${product.stock} left!</strong> : null}
                    <h1 className="text-center text-3xl md:text-5xl p-2">{product.name}</h1>
                    <img src="http://localhost:3000/static/images/test-image.png" alt="test" className="p-2"/>
                </div>
                <div className="md:w-1/2 flex flex-col gap-2 p-3">
                    <p className="text-2xl">Price: ${product.price}</p>
                    <p className="md:h-1/3 text-lg">{product.description}</p>
                    <div className="flex items-center justify-center gap-1">
                            <button className="flex justify-center items-center w-10 sm:w-12 h-6" onClick={() => setQuantity((prev) => prev - 1)}>-</button>
                            <p className="mx-2">{quantity}</p>
                            <button className="flex justify-center items-center w-10 sm:w-12 h-6" onClick={() => setQuantity((prev) => prev + 1)}>+</button>
                    </div>
                    <div className="flex items-center justify-center">
                        <button className="bg-green-600 text-white text-sm sm:text-base p-1 md:p-2 rounded-lg w-3/4 sm:w-2/4" onClick={addProduct}>Add to cart</button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col self-center w-2/3">
                <ReviewForm productId={product.id}/>
            </div>
        </div>
    )
}

export default ProductPage