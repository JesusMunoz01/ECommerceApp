import { useMutation } from "@tanstack/react-query";

const CheckoutPage = () => {
    const checkoutQuery = useMutation({
        mutationKey: ['checkout'],
        mutationFn: async () => {
            const response = await fetch('/api/payments/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: 1000 }),
            });
            const data = await response.json();
            return data;
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
