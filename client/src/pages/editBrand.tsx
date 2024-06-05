import { useParams } from "react-router-dom";

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
        <div>
            <h1>Edit Brand</h1>
            <div>
                <h2>Brand Details:</h2>
                <div>
                    <label>Name:</label>
                    <input type="text" value={brand.name} />
                </div>
                <div>
                    <label>Description:</label>
                    <input type="text" value={brand.description} />
                </div>
                <div>
                    <label>Image:</label>
                    <input type="text" value={brand.image} />
                </div>
                <button>Save</button>
            </div>
            <div>
                <h2>Products:</h2>
                <div>
                    Placeholder
                </div>
                <button>Add Product</button>
            </div>
        </div>
    )
};

export default EditBrandPage;