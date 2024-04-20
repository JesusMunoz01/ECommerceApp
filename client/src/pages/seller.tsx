import ProductForm from "../components/Products/productForm";


const SellPage = () => {

    return (
        <div className="flex gap-2 w-full" style={{ height: 'calc(100vh - 6rem)' }}>
            <div className="mt-2 w-11/12 flex flex-col items-center">
                <h1>Sell Page</h1>
                <p>Create A Product to Sell</p>
                <ProductForm />
            </div>
        </div>
    );
};

export default SellPage;