import { useAuth0 } from "@auth0/auth0-react";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

const CheckoutPage = () => {
    const { getAccessTokenSilently } = useAuth0();

    const checkoutQuery = useMutation({
        mutationKey: ['checkout'],
        mutationFn: async () => {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: [
                        {
                            name: 'T-shirt',
                            price: 20000,
                            quantity: 1,
                        },
                    ],
                }),
            });
            const data = await response.json();
            window.location = data.url;
        },
    })


    if (checkoutQuery.isPending) {
        return <div>Loading...</div>;
    }

    if (checkoutQuery.isError) {
        return <div>Error: </div>;
    }

    return (
        <div>
            <h1>Checkout</h1>
            <button onClick={() => checkoutQuery.mutate()} disabled={checkoutQuery.isPending}>Checkout</button>
        </div>
    );
};

export default CheckoutPage;
