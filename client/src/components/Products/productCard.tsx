
const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 100,
    image: 'test.jpg',
    description: 'Test description',
    category: 'Test category',
    };

const ProductCard = () => {
    return (
        <div className="bg-slate-300 shadow-lg rounded-lg overflow-hidden">
            <img src={mockProduct.image} alt={mockProduct.name} className="w-full h-64 object-cover object-center"/>
            <div className="p-6">
                <h3 className="text-gray-900 text-xl font-medium mb-2">{mockProduct.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{mockProduct.description}</p>
                <p className="text-gray-900 text-xl font-medium mb-2">${mockProduct.price}</p>
                <button className="bg-green-600 text-white p-2 rounded-lg w-3/4">Add to cart</button>
            </div>
        </div>
    );
}

export default ProductCard;