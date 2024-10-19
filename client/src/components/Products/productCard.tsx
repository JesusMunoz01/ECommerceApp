import { useState } from "react";
import { CartItem } from "../../pages/cart";

export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    discountNumber: number;
    //image: string;
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
        <div className="bg-slate-300 shadow-lg rounded-lg overflow-hidden xs:w-3/4 xs:mx-auto sm:w-full min-h-96 h-full">
            {/* <img src={product.image} alt={product.name} className="w-full h-64 object-cover object-center"/> */}
            <div className="p-6 flex flex-col h-full justify-between">
                <div className="h-11/12">
                    <h3 className="text-gray-900 text-xl font-medium mb-2 flex justify-between flex-col">
                        <span>{product.name}</span>
                        <span>${product.price}</span>
                    </h3>
                    <img src="http://localhost:3000/static/images/test-image.png" alt="test" className="mb-2"/>
                    <p className="text-gray-600 text-sm mb-2 max-h-24">{product.description}</p>
                </div>
                <div className="flex justify-evenly items-center gap-2 md:flex-col h-1/12">
                    {addToCart && <>
                    <div className="flex items-center justify-center gap-1">
                        <button className="flex justify-center items-center w-10 sm:w-12 h-6" onClick={() => setQuantity((prev) => prev - 1)}>-</button>
                        <p className="mx-2">{quantity}</p>
                        <button className="flex justify-center items-center w-10 sm:w-12 h-6" onClick={() => setQuantity((prev) => prev + 1)}>+</button>
                    </div>
                    <button className="bg-green-600 text-white text-sm sm:text-base p-1 md:p-2 rounded-lg w-fit sm:w-2/4 md:w-3/4" onClick={addProduct}>Add to cart</button>
                    </>}
                </div>
            </div>
        </div>
    );
}

export default ProductCard;