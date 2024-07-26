import CreateBrandForm from "../components/Brands/createBrandForm";

const CreateBrandPage = () => {
    return (
        <div className="flex flex-col justify-start xs:justify-center items-center w-full p-2">
            <h1 className="text-2xl xs:text-5xl p-2">Create Brand</h1>
            <CreateBrandForm />
        </div>
    );
};

export default CreateBrandPage;