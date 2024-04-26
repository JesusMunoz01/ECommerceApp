import { Product } from "./productCard";

type EditFormProps = {
    product: Product;
    handleEdit: (product: Product) => void;
};

const EditForm = ({product, handleEdit}: EditFormProps) => {

    return (
        <div className="flex flex-col border-t mt-2">
            <h1>Edit Product</h1>
            <form onSubmit={() => handleEdit(product)} className="flex flex-col gap-2 bg">
                <label htmlFor="name" className="text-lg">Name</label>
                <input type="text" id="name" name="name" className="pl-1" defaultValue={product.name} />
                <label htmlFor="price" className="text-lg">Price {`(USD)`}</label>
                <input type="number" id="price" name="price" className="pl-1" defaultValue={product.price} />
                <label htmlFor="description" className="text-lg">Description</label>
                <textarea rows={5} id="description" name="description" className="pl-1" defaultValue={product.description} />
                <button className="w-12/12 bg-zinc-900" type="submit">Submit</button>
            </form>
        </div>
    );
};

export default EditForm;
