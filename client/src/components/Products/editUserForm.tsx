import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const initialUser = {
    name: "",
    email: "",
    password: ""
};

const EditUserForm = () => {
    const { user } = useAuth0();
    const [updatedUser, setUpdatedUser] = useState(initialUser);
    const editUser = useMutation({
        mutationKey: ['editUser'],
        mutationFn: async () => {
            const userId = user?.sub?.split("|")[1];
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: updatedUser.name,
                    email: updatedUser.email,
                    password: updatedUser.password,
                })
            });
            const data = await response.json();
            return data;
        }
    });

    const handleChange= (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedUser({
            ...updatedUser,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editUser.mutate();
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input type="text" placeholder="Name" name="name" value={updatedUser.name} onChange={handleChange} />
                <input type="email" placeholder="Email" name="email" value={updatedUser.email} onChange={handleChange} />
                <input type="password" placeholder="Password" name="password" value={updatedUser.password} onChange={handleChange} />
                <button type="submit">Update</button>
            </form>
        </div>
    )
}

export default EditUserForm;