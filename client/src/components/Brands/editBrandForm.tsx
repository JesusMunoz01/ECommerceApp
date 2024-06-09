type EditBrandFormProps = {
    brandDetails: { name: string, description: string, image: string }
};

const EditBrandForm = ({brandDetails}: EditBrandFormProps) => {

    return (
        <div className="flex flex-col w-1/4 gap-2 m-1">
        <h1>Edit Brand</h1>
        <h2>Brand Details:</h2>
        <div className="flex flex-col">
            <label className="mr-1">Current Name:</label>
            <p>{brandDetails.name}</p>
            <label className="mr-1">Current Description:</label>
            <p>{brandDetails.description}</p>
            {/* <label className="mr-1">Current Image:</label>
            <img src={brand.image} alt={brand.name} /> */}
        </div>
        <form className="flex flex-col w-fit">
            <label className="mr-1">New Name:</label>
            <input type="text" value={brandDetails.name} onChange={() => {}}/>
            <label className="mr-1">New Description:</label>
            <input type="text" value={brandDetails.description} onChange={() => {}}/>
            {/* <label className="mr-1">New Image:</label>
            <input type="text" value={brand.image} /> */}
        </form>
        <button className="w-2/12">Save Changes</button>
    </div>
    )
}

export default EditBrandForm;