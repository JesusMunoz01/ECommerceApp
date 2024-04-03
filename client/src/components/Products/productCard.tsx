import { useState } from "react";
import { CartItem } from "../../pages/cart";

export type Product ={
    id: number
    name: string
    price: number
    //image: string,
    description: string,
    category: string,
};

type ProductCardProps = {
    product: Product
    addToCart?: (product: CartItem) => void
};

const ProductCard = ({product, addToCart}: ProductCardProps) => {
    const [quantity, setQuantity] = useState(1);

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
        <div className="bg-slate-300 shadow-lg rounded-lg overflow-hidden">
            {/* <img src={product.image} alt={product.name} className="w-full h-64 object-cover object-center"/> */}
            <div className="p-6 flex flex-col h-full justify-between">
                <div>
                    <h3 className="text-gray-900 text-xl font-medium mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                    <p className="text-gray-900 text-xl font-medium mb-2">${product.price}</p>
                </div>
                <div className="flex justify-between items-center gap-1 flex-col-reverse">
                    {addToCart && <button className="bg-green-600 text-white p-2 rounded-lg w-3/4" onClick={addProduct}>Add to cart</button>}
                    <div className="flex items-center justify-center">
                        <button className="flex justify-center items-center w-12 h-6" onClick={() => setQuantity((prev) => prev - 1)}>-</button>
                        <p className="mx-2">{quantity}</p>
                        <button className="flex justify-center items-center w-12 h-6" onClick={() => setQuantity((prev) => prev + 1)}>+</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;