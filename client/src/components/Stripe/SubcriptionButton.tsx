import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";


const SubscriptionButton = ({tier}: {tier?: Number}) => {
    const { getAccessTokenSilently, user } = useAuth0();

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


    if (subscribeQuery.isPending) {
        return <div>Loading...</div>;
    }

    if (subscribeQuery.isError) {
        return <div>Error: </div>;
    }

    return (
        <div>
            <button className="mb-4 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:border-none p-2 w-24" 
                onClick={() => subscribeQuery.mutate()} disabled={subscribeQuery.isPending}>Subscribe</button>
        </div>
    );
};

export default SubscriptionButton;
