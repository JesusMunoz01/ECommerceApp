import { useState } from "react";
import { Link } from "react-router-dom";

type ProductSelectionPopupProps = {
    products: any[];
    onClose: () => void;
    actionType?: string;
    onProductsAction: (products: number[]) => void;
};

type SelectedProducts = number[];

const ProductSelectionPopup = ({ products, actionType = "add", onClose, onProductsAction }: ProductSelectionPopupProps) => {
const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>([]);

const handleSelectProduct = (productId: number) => {
    setSelectedProducts((prev) =>
    prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
};

return (
    <div className="h-1/2 w-1/2">
    <div className="bg-slate-600 h-full">
        <div className="flex justify-between p-2">
            <h1>Your Products:</h1>
            <button className="w-1/12 bg-red-700" onClick={onClose}>Close</button>
        </div>
        <p className="p-2">(Products already in brand will not appear here)</p>
        <div className="h-2/4 p-2 mb-8">
            {products.map((product) => (
            <div key={product.id}>
                <input
                className="mr-2"
                type="checkbox"
                name="productCheckbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => handleSelectProduct(product.id)}
                />
                {product.name}
            </div>
            ))}
        </div>
        <button className="ml-2 p-1" name="productSelectionBtn" onClick={() => onProductsAction(selectedProducts)}>
            {actionType === "add" ? "Add selected products": "Remove selected products" }
        </button>
        <Link to="/sell"><button className="ml-2 p-1">Create a product</button></Link>
    </div>
    </div>
);
};

export default ProductSelectionPopup;