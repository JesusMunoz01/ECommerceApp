
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
};

const ProductCard = ({product}: ProductCardProps) => {
    return (
        <div className="bg-slate-300 shadow-lg rounded-lg overflow-hidden">
            {/* <img src={product.image} alt={product.name} className="w-full h-64 object-cover object-center"/> */}
            <div className="p-6">
                <h3 className="text-gray-900 text-xl font-medium mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <p className="text-gray-900 text-xl font-medium mb-2">${product.price}</p>
                <button className="bg-green-600 text-white p-2 rounded-lg w-3/4">Add to cart</button>
            </div>
        </div>
    );
}

export default ProductCard;