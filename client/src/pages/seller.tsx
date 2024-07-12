import ProductForm from "../components/Products/productForm";


const SellPage = () => {

    return (
        <div className="flex gap-2 w-full h-full">
            <div className="mt-2 w-full flex flex-col items-center justify-center">
                <h1 className="text-2xl md:text-base">Sell Your Products</h1>
                <p className="text-base md:text-xl mb-4">Create A Product to Sell</p>
                <div className="w-11/12 p-2 md:w-6/12 border border-slate-500 md:p-4">
                    <ProductForm actionType="Create"/>
                </div>
            </div>
        </div>
    );
};

export default SellPage;