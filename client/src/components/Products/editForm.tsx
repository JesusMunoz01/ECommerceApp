import { Product } from "./productCard";

type EditFormProps = {
    product: Product;
    handleEdit: (product: Product) => void;
};

const EditForm = ({product, handleEdit}: EditFormProps) => {

    return (
        <div className="flex flex-col">
            <h1>Edit Product</h1>
            <form onSubmit={() => handleEdit(product)} className="flex flex-col gap-2 bg">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" defaultValue={product.name} />
                <label htmlFor="price">Price {`(USD)`}</label>
                <input type="number" id="price" name="price" defaultValue={product.price} />
                <label htmlFor="description">Description</label>
                <textarea rows={5} id="description" name="description" defaultValue={product.description} />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default EditForm;
