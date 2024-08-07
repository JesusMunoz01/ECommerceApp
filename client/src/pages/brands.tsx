import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

const BrandsPage = () => {
    const [search, setSearch] = useState('');
    const brandsQuery = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/brands`);
            const data = await response.json();
            return data;
        }
    });

    if(brandsQuery.isLoading) return <div>Loading...</div>;
    if(brandsQuery.isError) return <div>Error fetching brands</div>;

    return (
        <div className="m-1">
            <div>
                <h1>Brands</h1>
                <search className="border border-white w-fit m-1">
                    <input type="text" className="p-1" placeholder="Search Brands" onChange={(e) => setSearch(e.target.value)}/>
                </search>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-12/12 m-2">
                {brandsQuery.data.data.filter((brand: any) => brand.name.toLowerCase().includes(search.toLowerCase())).map((brand: any) => (
                    <Link key={brand.id} to={`/brands/${brand.id}`}>
                        <div key={brand.id} className="flex flex-col gap-4 border-2 p-2 bg-slate-700 min-h-64 max-h-64">
                            <h2 className="font-semibold text-xl border-b">{brand.name}</h2>
                            <p>{brand.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default BrandsPage;