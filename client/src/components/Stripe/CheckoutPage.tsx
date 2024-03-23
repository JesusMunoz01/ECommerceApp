import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";
import { CartItem } from "../../pages/cart";

type CheckoutProps = {
    cart: CartItem[];
};

const CheckoutPage = ({cart}: CheckoutProps) => {
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
                    items: cart.map((product) => ({
                        name: product.name,
                        price: product.price,
                        quantity: product.quantity,
                    })),
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
