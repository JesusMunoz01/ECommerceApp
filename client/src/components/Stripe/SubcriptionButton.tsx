import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../../utils/userContext";

const SubscriptionButton = ({tier}: {tier?: Number}) => {
    const { loginWithPopup, getAccessTokenSilently, user } = useAuth0();
    const { userData } = useUser();

    const subscribeQuery = useMutation({
        mutationKey: ['subscription'],
        mutationFn: async () => {

            let userId = null;
            if(user)
                userId = user.sub;

            const token = await getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: userId,
                    tier: tier,
                }),
            });
            const data = await response.json();
            window.location = data.url;
        },
    })

    const upgradeQuery = useMutation({
        mutationKey: ['upgrade'],
        mutationFn: async () => {

            let userId = null;
            if(user)
                userId = user.sub;

            const token = await getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/upgrade-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: userId,
                    tier: tier,
                }),
            });
            const data = await response.json();
            window.location = data.url;
        },
    })

    const handleSubscription = async () => {
        if(user && userData?.plan === "Free" && tier )
            subscribeQuery.mutate();
        else if(user && userData?.plan === "Premium" && tier)
            upgradeQuery.mutate();
        else
            loginWithPopup()
    }

    if (subscribeQuery.isPending) {
        return <div>Loading...</div>;
    }

    if (subscribeQuery.isError) {
        return <div>Error: </div>;
    }

    return (
        <div>
            <button className="mb-4 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:border-none p-2 w-24" 
                onClick={() => handleSubscription()} disabled={subscribeQuery.isPending}>Subscribe</button>
        </div>
    );
};

export default SubscriptionButton;
