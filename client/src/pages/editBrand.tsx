import EditBrand from "../components/Brands/editBrand";

type EditBrandPageProps = {
    userData: { message: string; plan: string }
};

const EditBrandPage = ({userData}: EditBrandPageProps) => {
    console.log(userData);
    return (
        <div>
            <EditBrand />
        </div>
    )
};

export default EditBrandPage;