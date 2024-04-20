import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

const EditUserForm = () => {
    const { user } = useAuth0();
    const [updatedUser, setUpdatedUser] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange= (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedUser({
            ...updatedUser,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(updatedUser);
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