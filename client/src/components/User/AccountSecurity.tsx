import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../../utils/userContext";
import DeleteButton from "../Buttons/DeleteButton";

interface AccountSecurityProps {
    onClick: () => void;
}

const AccountSecurity = ({onClick}: AccountSecurityProps) => {
    const {user} = useAuth0();
    const {userData} = useUser();
    console.log(userData);


    return (
        <div className="border-t flex flex-col gap-2">
            <div className="h-40 mt-4">
                <div className="flex flex-col ml-2 gap-2 h-full">
                    <h2>Verification Status: {user?.email_verified ? "Verified": "Not Verified"}</h2>
                    <h2>Subscription Status: {userData?.plan}</h2>
                </div>
            </div>
            <div className="flex justify-center items-center">
                <button className="block hover:bg-slate-400 focus:outline-non transition duration-150 ease-in-out w-1/2 text-center px-4 py-2 rounded-md self-center" 
                onClick={onClick}>Edit Password</button>
                <DeleteButton action={()=>{}}>Cancel Subscription</DeleteButton>
            </div>
        </div>
    );
}

export default AccountSecurity;