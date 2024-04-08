import { Product } from "./productCard";

type EditFormProps = {
    product: Product;
};

const EditForm = ({product}: EditFormProps) => {

    return (
        <div>
            <h1>Edit Product</h1>
            <form >
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" defaultValue={product.name} />
                <label htmlFor="price">Price</label>
                <input type="number" id="price" name="price" defaultValue={product.price} />
                <label htmlFor="description">Description</label>
                <input type="text" id="description" name="description" defaultValue={product.description} />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default EditForm;
