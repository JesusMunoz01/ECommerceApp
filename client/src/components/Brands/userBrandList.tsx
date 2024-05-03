import { useAuth0 } from "@auth0/auth0-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";

const UserBrandPagesList = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [editingBrandId, setEditingBrandId] = useState<number | null>(null);
    const [filter, setFilter] = useState<string>('');
    const formRefs = useRef<{ [key: number]: React.RefObject<HTMLDivElement> | null }>({});
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['userBrands', user?.id],
        queryFn: async () => {
            const token = await getAccessTokenSilently();
            const userId = user?.sub?.split('|')[1];
            const response = await fetch(`${import.meta.env.VITE_API_URL}/brands/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            return data;
        }
    });

    useEffect(() => {
        if (editingBrandId !== null && formRefs.current[editingBrandId]?.current) {
            formRefs.current[editingBrandId]?.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [editingBrandId, formRefs]);

    const deleteMutation = useMutation({
        mutationKey: ['deletePage'],
        mutationFn: async (id: number) => {
            const token = await getAccessTokenSilently()
            const response = await fetch(`${import.meta.env.VITE_API_URL}/brands/${id}/${user?.sub}`, {
                method: 'DELETE',  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            return data;
        },
        onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['userBrands', user?.id]
                });
        }
    });

    const handleEditChange = (id: number) => {
        if (editingBrandId === id) 
            setEditingBrandId(null);
        else
            setEditingBrandId(id);
    }

    const handleDelete = async (id: number) => {
        await deleteMutation.mutateAsync(id);
    };
    
    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No Products Found</p>;
    
    return (
        <div>
            <input type="text" placeholder="Filter Products" className="border border-slate-600 p-1 mb-2 w-2/4" onChange={(e) => setFilter(e.target.value)} />
            <div className="border border-slate-500 p-1" style={{maxHeight: "60vh"}}>
                <ul className="flex flex-col gap-4 w-10/12 overflow-y-auto">
                    {data.brandPages.map((page: any) => (
                    <div key={page.id} className="flex flex-col border border-slate-600 gap-2 p-2">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl">{page.name}</h2>
                            <p className="text-lg">{page.description}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-2/12" onClick={() => handleEditChange(page.id)}>Edit</button>
                            <button className="w-2/12" onClick={() => handleDelete(page.id)}>Delete</button>
                        </div>
                        <div ref={(ref) => { formRefs.current[page.id] = ref ? { current: ref } : null; }}>
                            {editingBrandId === page.id && (
                                <div className="flex flex-col border-t mt-2">
                                    <h1>Edit Brand</h1>
                                    {/* <ProductForm actionType="Update" userProduct={product} /> */}
                                </div>
                            )}
                        </div>
                    </div>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserBrandPagesList;
