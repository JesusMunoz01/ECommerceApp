import { useState } from "react";

type ProductSelectionPopupProps = {
    products: any[];
    onClose: () => void;
    onAddProducts: (products: number[]) => void;
};

type SelectedProducts = number[];

const ProductSelectionPopup = ({ products, onClose, onAddProducts }: ProductSelectionPopupProps) => {
const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>([]);

const handleSelectProduct = (productId: number) => {
    setSelectedProducts((prev) =>
    prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
};

return (
    <div className="popup">
    <div className="popup-inner">
        <button onClick={onClose}>Close</button>
        {products.map((product) => (
        <div key={product.id}>
            <input
            type="checkbox"
            checked={selectedProducts.includes(product.id)}
            onChange={() => handleSelectProduct(product.id)}
            />
            {product.name}
        </div>
        ))}
        <button onClick={() => onAddProducts(selectedProducts)}>Add Selected Products</button>
    </div>
    </div>
);
};

export default ProductSelectionPopup;