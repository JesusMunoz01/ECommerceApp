import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ProductCard from "../components/Products/productCard";
import { useState } from "react";

const testProducts = [
    {
        id: 1,
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        image: ''
    },
    {
        id: 2,
        name: 'Product 2',
        description: 'Product 2 description',
        price: 200,
        image: ''
    },
    {
        id: 3,
        name: 'Product 3',
        description: 'Product 3 description',
        price: 300,
        image: ''
    },
    {
        id: 4,
        name: 'Product 4',
        description: 'Product 4 description',
        price: 400,
        image: ''
    },
    {
        id: 5,
        name: 'Product 5',
        description: 'Product 5 description',
        price: 500,
        image: ''
    },
];

const BrandPage = () => {
    const { id } = useParams();
    const [search, setSearch] = useState('');
    const brandQuery = useQuery({
        queryKey: ['brands', id],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/brands/${id}`);
            const data = await response.json();
            console.log(data);
            return data;
        }
    });

    if(brandQuery.isLoading) return <div>Loading...</div>;
    if(brandQuery.isError) return <div>Error fetching brand</div>;

    return (
        <div>
            <div className="flex items-center justify-center flex-row bg-slate-500 h-fit">
                { brandQuery.data.data.image && <img src={brandQuery.data.data.image} alt={brandQuery.data.data.name}/> }
                <div className="flex items-center justify-center flex-col bg-slate-500 pb-2">
                    <h1>{brandQuery.data.data.name}</h1>
                    <p>{brandQuery.data.data.description}</p>
                </div>
            </div>
            <div>
                {/* <h2>Products</h2>
                <div className="grid grid-cols-5 gap-4 w-12/12 m-2">
                    {brandQuery.data.data.products.map((product: any) => (
                        <ProductCard key={product.id} product={product}/>
                    ))}
                </div> */}
                <div className="flex items-center justify-between">
                    <h2 className="m-2 text-3xl p-1">Brand's Products:</h2>
                    <search className="border border-white w-fit m-2">
                        <input type="text" className="p-1 w-64" placeholder="Search Products" onChange={(e) => setSearch(e.target.value)}/>
                    </search>
                </div>
                <div className="grid grid-cols-5 gap-4 w-12/12 m-2">
                    {testProducts.filter(product => product.name.includes(search)).map((product: any) => (
                        <ProductCard key={product.id} product={product} addToCart={() => {}}/>
                    ))}
                    {testProducts.filter(product => product.name.includes(search)).length === 0 && <div>No Products Found</div>}
                </div>
            </div>
        </div>
    );
};

export default BrandPage;