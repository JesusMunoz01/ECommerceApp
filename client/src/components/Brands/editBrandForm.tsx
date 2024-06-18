import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";

type EditBrandFormProps = {
    brandDetails: { name: string, description: string, image: string, id: string}
};

const editForm = {
    name: '',
    description: '',
    image: ''
};

const EditBrandForm = ({brandDetails}: EditBrandFormProps) => {
    const {user, getAccessTokenSilently} = useAuth0();
    const [newBrandDetails, setNewBrandDetails] = useState(brandDetails ? {
        name: brandDetails.name,
        description: brandDetails.description,
        image: brandDetails.image
    } : editForm);
    const [validationMessages, setValidationMessages] = useState({ name: '', description: ''});
    const fileInputRef = useRef(null);

    const validateForm = () => {
        let isValid = true;
        let errors = { name: '', description: '', image: '' };

        if (!newBrandDetails.name.trim()) {
            errors.name = 'Name is required';
            isValid = false;
        }
        if (!newBrandDetails.description.trim()) {
            errors.description = 'Description is required';
            isValid = false;
        }

        setValidationMessages(errors);
        return isValid;
    };

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
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        await updateBrandQuery.mutate();
        // TODO: Create context for user data and update the brand details
        setNewBrandDetails({...brandDetails, name: '', description: '', image: ''});
    }

    return (
        <div className="flex flex-col h-full w-1/4 gap-2 mr-1 ml-1 p-1 align-center justify-evenly">
        <h1>Edit Brand</h1>
        <h2>Brand Details:</h2>
        <div className="flex flex-col gap-2 border-b-slate-400 border-b-2 pb-4">
            <label className="mr-1">Current Name:</label>
            <p style={{backgroundColor: "#3B3B3B"}}>{brandDetails.name}</p>
            <label className="mr-1">Current Description:</label>
            <p style={{backgroundColor: "#3B3B3B", height: "10vh"}}>{brandDetails.description}</p>
            <label className="mr-1">Current Image:</label>
            { brandDetails.image ?
                <img src={brandDetails.image} alt={brandDetails.name} /> : <p>No Image</p>
            }
        </div>
        <form className="flex flex-col w-full gap-2" onSubmit={handleSubmit}>
            <label className="mr-1">New Name:</label>
            <input className="w-3/4 pl-2" type="text" value={newBrandDetails.name} onChange={(e) => setNewBrandDetails({...newBrandDetails, name: e.target.value})}/>
            {validationMessages.name && <p className="text-red-500">{validationMessages.name}</p>}
            <label className="mr-1">New Description:</label>
            <textarea className="w-full pl-2" rows={4} value={newBrandDetails.description} onChange={(e) => setNewBrandDetails({...newBrandDetails, description: e.target.value})}/>
            {validationMessages.description && <p className="text-red-500">{validationMessages.description}</p>}
            <label className="mr-1">New Image:</label>
            <input ref={fileInputRef} id="fileInput" className="hidden" type="file" accept="image/*" onChange={(e) => setNewBrandDetails({...newBrandDetails, image: e.target.value})}/>
            <label htmlFor="fileInput" className="w-3/4 cursor-pointer inline-block text-center py-2 bg-blue-500 text-white self-center">
                Choose File
            </label>
        </form>
        <button type="submit" className="w-1/2 self-center">Save Changes</button>
    </div>
    )
}

export default EditBrandForm;