import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialUser = {
    name: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
};

type EditUserFormProps = {
    onCancel?: () => void;
    type: "security" | "profile";
};

const EditUserForm = ({onCancel, type}: EditUserFormProps) => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [updatedUser, setUpdatedUser] = useState(initialUser);
    const [error, setError] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();
    // const editUser = useMutation({
    //     mutationKey: ['editUser'],
    //     mutationFn: async () => {
    //         const token = await getAccessTokenSilently();
    //         const userId = user?.sub?.split("|")[1];
    //         const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
    //             method: 'PATCH',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify({
    //                 name: updatedUser.name,
    //                 email: updatedUser.email,
    //                 password: updatedUser.password,
    //             })
    //         });
    //         const data = await response.json();
    //         return data;
    //     }
    // });
    const editUserAuth = useMutation({
        mutationKey: ['editUserAuth'],
        mutationFn: async () => {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/${user?.sub}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
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

    const validateForm = () => {
        let isValid = true;
        let errors = { name: '', email: '', password: '' };

        if (updatedUser.name !== "") {
            if (updatedUser.name.length < 3 || updatedUser.name.length > 50) {
                errors.name = 'Name must be between 5 and 50 characters';
                isValid = false;
            }
        }
        if (updatedUser.email !== "") {
            if (updatedUser.email.length < 5 || updatedUser.email.length > 255) {
                errors.email = 'Email must be between 5 and 255 characters';
                isValid = false;
            }
            if(updatedUser.email !== updatedUser.confirmEmail) {
                errors.email = 'Emails do not match';
                isValid = false;
            }
        }
        if (updatedUser.password !== "") {
            if (updatedUser.password.length < 8 || updatedUser.password.length > 255) {
                errors.password = 'Password must be between 8 and 255 characters';
                isValid = false;
            }
            if(updatedUser.password !== updatedUser.confirmPassword) {
                errors.password = 'Passwords do not match';
                isValid = false;
            }
        }

        setError(errors);

        return isValid;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        //editUser.mutate();
        editUserAuth.mutate();
        navigate('/account');
    };

    return (
        <div className="lg:w-2/6 md:w-1/2 sm:w-3/4 w-11/12">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-slate-600 p-4 border">
                {type === "profile" ? 
                <>
                    <h1>Edit User</h1>
                    <div className="flex flex-col gap-2 border-b-4 pb-4 border-slate-800">
                        <label htmlFor="name">Name</label>
                        <input type="text" placeholder="Name" name="name" value={updatedUser.name} onChange={handleChange} />
                        <span className="text-red-500">{error.name}</span>
                    </div>
                    <div className="flex flex-col gap-2 border-b-4 pb-4 border-slate-800">
                        <label htmlFor="email">Email</label>
                        <input type="email" placeholder="Email" name="email" value={updatedUser.email} onChange={handleChange} />
                        <label htmlFor="confirmEmail">Confirm Email</label>
                        <input type="email" placeholder="Confirm Email" name="confirmEmail" value={updatedUser.confirmEmail} onChange={handleChange}/>
                        <span className="text-red-500">{error.email}</span>
                    </div> 
                </>:
                <>
                    <h1>Edit Password</h1>
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Password" name="password" value={updatedUser.password} onChange={handleChange} />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" placeholder="Confirm Password" name="confirmPassword"  value={updatedUser.confirmPassword} onChange={handleChange}/>
                    <span className="text-red-500">{error.password}</span>
                </>
                }
                <div className="flex gap-4">
                    <button type="submit" className="bg-gray-800 w-1/2 self-center mt-2">Update</button>
                    {onCancel && <button className="bg-gray-800 w-1/2 self-center mt-2" onClick={onCancel}>Cancel</button>}
                </div>
            </form>
        </div>
    )
}

export default EditUserForm;