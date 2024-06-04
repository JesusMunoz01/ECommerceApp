import { useParams } from "react-router-dom";
import EditBrand from "../components/Brands/editBrand";

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
            <EditBrand />
        </div>
    )
};

export default EditBrandPage;