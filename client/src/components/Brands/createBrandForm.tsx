import { useAuth0 } from "@auth0/auth0-react";
import { useUserProductsQuery } from "../../utils/useQueries";
import Button from "../Buttons/Button";
import { useState } from "react";
import ProductSelectionPopup from "../Popups/productSelect";
import { useMutation } from "@tanstack/react-query";

type BrandData = {
    name: string;
    description: string;
    image: string;
    products: string[];
}

const CreateBrandForm = () => {
    const { user } = useAuth0();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const userProducts = useUserProductsQuery(user?.sub?.split('|')[1]);

    const createBrandQuery = useMutation({
        mutationKey: ['createBrand'],
        mutationFn: async (brand: BrandData) => {
            const response = await fetch('/api/brands', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(brand)
            });

            if (!response.ok) {
                throw new Error('Failed to create brand');
            }

            return response.json();
        }
    })

    const handleProductSelection = (products: number[]) => {
        setSelectedProducts((prev) => [...prev, ...products]);
    }

    const togglePopup = () => {
        setIsPopupVisible((prev) => !prev);
    }

    return (
            <form className="flex flex-col justify-center items-center w-full max-w-2xl gap-2 border-slate-500 border p-2">
                {isPopupVisible && 
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
                    <ProductSelectionPopup products={userProducts.data.products} onClose={togglePopup} onProductsAction={handleProductSelection} />
                </div>
                }
                <div className="mb-3 flex flex-col w-full max-w-2xl">
                    <label htmlFor="brandName">Brand Name</label>
                    <input type="text"/>
                </div>
                <div className="mb-3 flex flex-col w-full max-w-2xl">
                    <label htmlFor="brandDescription">Brand Description</label>
                    <textarea rows={3}></textarea>
                </div>
                <div className="mb-3 flex flex-col w-full max-w-2xl">
                    <label htmlFor="brandItems">Brand Items</label>
                    <button className="w-2/12" type="button" onClick={togglePopup}>Add New Product</button>
                </div>
                <div className="mb-3 flex flex-col w-full max-w-2xl">
                    <label htmlFor="brandLogo">Brand Logo</label>
                    <input type="file" className="text-base" />
                </div>
                <div className="w-1/2 max-w-72">
                    <Button action={()=>{}}>Submit</Button>
                </div>
            </form>
    )
}

export default CreateBrandForm;
