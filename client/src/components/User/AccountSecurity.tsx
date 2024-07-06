import { useAuth0 } from "@auth0/auth0-react";

interface AccountSecurityProps {
    onClick: () => void;
}

const AccountSecurity = ({onClick}: AccountSecurityProps) => {
    const {user} = useAuth0();

    return (
        <div className="border-t flex flex-col gap-2">
            <div className="h-40 mt-4">
                <div className="flex flex-col ml-2 gap-2 h-full">
                    <h2>Verification Status: {user?.email_verified ? "Verified": "Not Verified"}</h2>
                </div>
            </div>
            <button className="block hover:bg-slate-400 focus:outline-non transition duration-150 ease-in-out w-1/2 text-center px-4 py-2 rounded-md self-center" 
            onClick={onClick}>Edit Password</button>
        </div>
    );
}

export default AccountSecurity;