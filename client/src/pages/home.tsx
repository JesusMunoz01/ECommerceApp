import ProductCard from "../components/Products/productCard";

const HomePage = () => {
    return (
        <div className="flex justify-center items-center flex-col w-full">
            <div className="mt-2">
                <h1>Home Page</h1>
            </div>
            <div className="flex justify-center items-center flex-col w-full">
                <h2>Featured Products</h2>
                <div className="grid grid-cols-5 gap-4 w-full">
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                </div>
            </div>
        </div>
    );
};

export default HomePage;