const CreateBrandForm = () => {

    return (
        <form>
            <div className="mb-3">
                <label htmlFor="brandName" className="form-label">Brand Name</label>
                <input type="text" className="form-control" id="brandName" />
            </div>
            <div className="mb-3">
                <label htmlFor="brandDescription" className="form-label">Brand Description</label>
                <textarea className="form-control" id="brandDescription" rows={3}></textarea>
            </div>
            <div className="mb-3">
                <label htmlFor="brandLogo" className="form-label">Brand Logo</label>
                <input type="file" className="form-control" id="brandLogo" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
}

export default CreateBrandForm;
