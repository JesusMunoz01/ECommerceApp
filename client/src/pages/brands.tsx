import { useQuery } from "@tanstack/react-query";

const BrandsPage = () => {
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
            <h1>Brands</h1>
            <div className="grid grid-cols-5 gap-4 w-12/12 m-2">
                {brandsQuery.data.data.map((brand: any) => (
                    <div key={brand.id} className="border-2 p-2 bg-slate-700">
                        <h2>{brand.name}</h2>
                        <p>{brand.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BrandsPage;