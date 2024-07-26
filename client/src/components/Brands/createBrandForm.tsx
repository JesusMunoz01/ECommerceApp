import Button from "../Buttons/Button";

const CreateBrandForm = () => {

    return (
        <form className="flex flex-col justify-center items-center w-full max-w-2xl gap-2 border-slate-500 border p-2">
            <div className="mb-3 flex flex-col w-full max-w-2xl">
                <label htmlFor="brandName">Brand Name</label>
                <input type="text"/>
            </div>
            <div className="mb-3 flex flex-col w-full max-w-2xl">
                <label htmlFor="brandDescription">Brand Description</label>
                <textarea rows={3}></textarea>
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
