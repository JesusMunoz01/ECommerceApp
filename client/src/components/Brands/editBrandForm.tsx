import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type EditBrandFormProps = {
    brandDetails: { name: string, description: string, image: string, id: string}
};

const EditBrandForm = ({brandDetails}: EditBrandFormProps) => {
    const {user, getAccessTokenSilently} = useAuth0();
    const [newBrandDetails, setNewBrandDetails] = useState(brandDetails);
    const queryClient = useQueryClient();
    const updateBrandQuery = useMutation({
        mutationKey: ['brands','update'],
        mutationFn: async () => {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/brands/${brandDetails.id}/${user?.sub?.split(`|`)[1]}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                method: 'PATCH',
                body: JSON.stringify(newBrandDetails)
            });
            const data = await response.json();
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['brands', brandDetails.id]
            });
        }
    })

    const saveChangesHandler = () => {
        updateBrandQuery.mutate();
    }

    return (
        <div className="flex flex-col w-1/4 gap-2 m-1">
        <h1>Edit Brand</h1>
        <h2>Brand Details:</h2>
        <div className="flex flex-col">
            <label className="mr-1">Current Name:</label>
            <p>{brandDetails.name}</p>
            <label className="mr-1">Current Description:</label>
            <p>{brandDetails.description}</p>
            {/* <label className="mr-1">Current Image:</label>
            <img src={brand.image} alt={brand.name} /> */}
        </div>
        <form className="flex flex-col w-full">
            <label className="mr-1">New Name:</label>
            <input className="w-3/4" type="text" value={newBrandDetails.name} onChange={(e) => setNewBrandDetails({...newBrandDetails, name: e.target.value})}/>
            <label className="mr-1">New Description:</label>
            <textarea className="w-full" rows={4} value={newBrandDetails.description} onChange={(e) => setNewBrandDetails({...newBrandDetails, description: e.target.value})}/>
            {/* <label className="mr-1">New Image:</label>
            <input type="text" value={brand.image} /> */}
        </form>
        <button className="w-1/2" onClick={saveChangesHandler}>Save Changes</button>
    </div>
    )
}

export default EditBrandForm;