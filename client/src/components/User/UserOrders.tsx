import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type Orders = {
    id: number
    userId: string;
    total: number;
    status: "Pending" | "Completed" | "Cancelled";
    paymentMethod: string;
    shippingAddress: string;
    createdAt: Date;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
};

const UserOrders = () => {
    const {user, getAccessTokenSilently} = useAuth0();

    const ordersQuery = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/user/${user?.sub}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log(data)
            return data
        },
    });

    if(ordersQuery.isLoading)
        return <h1>Loading...</h1>
    
    return (
        <div className="flex flex-col gap-1 h-full">
            <h1 className="mb-2 min-h-20 text-3xl md:text-6xl">Your Orders</h1>
            <div>
            {/* TODO: Format orders so that it has one order id with all the items */}
            {ordersQuery.data.fullOrders.map((order: any) => (
                <div key={order.id} className="border-t flex flex-col gap-2 mb-2">
                <h2 className="mt-2">Order ID: {order.id}</h2>
                <p>Total: ${order.total}</p>
                <p>Order Date: {new Date(order.createdAt).toLocaleString()}</p>
                <p>Order Status: {order.status}</p>
                <h3>Items:</h3>
                <ul>
                    {order.items.map((item: any, index: number) => (
                    <li key={index}>
                        {index+1}. {item.productName} (${item.productPrice})
                    </li>
                    ))}
                </ul>
                </div>
            ))}
            </div>
        </div>
    );
};

export default UserOrders;