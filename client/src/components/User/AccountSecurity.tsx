import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../../utils/userContext";
import DeleteButton from "../Buttons/DeleteButton";
import { useMutation } from "@tanstack/react-query";
import ConfirmationPopup from "../Popups/confirmPopup";
import { useState } from "react";

interface AccountSecurityProps {
    onClick: () => void;
}

const AccountSecurity = ({onClick}: AccountSecurityProps) => {
    const {user, getAccessTokenSilently} = useAuth0();
    const {userData} = useUser();
    const [isSubCancel, setIsSubCancel] = useState(false);

    const cancelSubQuery = useMutation({
        mutationKey: ["cancelSubscription"],
        mutationFn: async () => {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/cancel-subscription`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                //body: JSON.stringify({userId: user?.sub})
            });
            const data = await response.json();
            return data;
        }
    });

    const confirmHandler = async () => {
        await cancelSubQuery.mutate();
        setIsSubCancel(false);
    }


    return (
        <div className="border-t flex flex-col gap-2">
            {isSubCancel && 
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
                    <ConfirmationPopup 
                    title="Cancel Subscription"
                    message="Are you sure you want to cancel your subscription?" 
                    onConfirm={confirmHandler} 
                    onCancel={()=>setIsSubCancel(false)}/>
                </div>
            }
            <div className="h-40 mt-4">
                <div className="flex flex-col ml-2 gap-2 h-full">
                    <h2>Verification Status: {user?.email_verified ? "Verified": "Not Verified"}</h2>
                    <h2>Subscription Status: {userData?.plan}</h2>
                </div>
            </div>
            <div className="flex justify-center items-center gap-4">
                <button className="block hover:bg-slate-400 focus:outline-non transition duration-150 ease-in-out w-1/2 text-center px-4 py-2 rounded-md self-center" 
                onClick={onClick}>Edit Password</button>
                <DeleteButton action={()=>setIsSubCancel(true)} className="w-1/2 rounded-md">
                    Cancel Subscription
                </DeleteButton>
            </div>
        </div>
    );
}

export default AccountSecurity;