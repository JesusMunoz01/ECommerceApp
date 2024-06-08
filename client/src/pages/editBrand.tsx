import { useParams } from "react-router-dom";
import ProductCard from "../components/Products/productCard";

type EditBrandPageProps = {
    userData: { message: string; plan: string, brands: any[]}
};

const EditBrandPage = ({userData}: EditBrandPageProps) => {
    const { id } = useParams();
    if(!userData) return <div>Loading...</div>;

    if(userData.brands.length === 0) return <div>No brands found</div>;
    const brand = userData.brands.find(brand => brand.id === Number(id));
    if(!brand) return <div>Brand not found</div>;
    
    return (
        <div className="flex flex-row">
            <div className="flex flex-col w-1/4 gap-2 m-1">
                <h1>Edit Brand</h1>
                <h2>Brand Details:</h2>
                <div className="flex flex-col">
                    <label className="mr-1">Current Name:</label>
                    <p>{brand.name}</p>
                    <label className="mr-1">Current Description:</label>
                    <p>{brand.description}</p>
                    {/* <label className="mr-1">Current Image:</label>
                    <img src={brand.image} alt={brand.name} /> */}
                </div>
                <form className="flex flex-col w-fit">
                    <label className="mr-1">New Name:</label>
                    <input type="text" value={brand.name} />
                    <label className="mr-1">New Description:</label>
                    <input type="text" value={brand.description} />
                    {/* <label className="mr-1">New Image:</label>
                    <input type="text" value={brand.image} /> */}
                </form>
                <button className="w-2/12">Save Changes</button>
            </div>
            <div className="flex flex-col w-1/2 m-1">
                <h1>Your Products:</h1>
                <div>
                    <h2>Product Details:</h2>
                    {true && <h2>No products found</h2>}
                    {/* <ProductCard /> */}
                </div>
                <button className="w-2/12">Add Product</button>
            </div>
        </div>
    )
};

export default EditBrandPage;