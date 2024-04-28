import ProductForm from "../components/Products/productForm";


const SellPage = () => {

    return (
        <div className="flex gap-2 w-full" style={{ height: 'calc(100vh - 6rem)' }}>
            <div className="mt-2 w-full flex flex-col items-center">
                <h1>Sell Your Products</h1>
                <p className="text-xl mb-4">Create A Product to Sell</p>
                <div className="w-6/12 border border-slate-500 p-4">
                    <ProductForm actionType="Create"/>
                </div>
            </div>
        </div>
    );
};

export default SellPage;