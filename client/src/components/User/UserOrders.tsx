import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type Orders = {
    userId: string;
    total: number;
    status: "Pending" | "Completed" | "Cancelled";
    paymentMethod: string;
    shippingAddress: string;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
};

const UserOrders = () => {
    const [orders, setOrders] = useState<Orders[]>([]);
    const {user, getAccessTokenSilently} = useAuth0();

    const ordersQuery = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const token = getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/user/${user?.sub}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.json())
            return response.json();
        },
    });

    useEffect(() => {
        setOrders(ordersQuery.data as Orders[]);
    }, []);
    
    return (
        <div className="flex flex-col gap-1 h-full">
        <h1 className="mb-2 min-h-20 text-3xl md:text-6xl">Your Orders</h1>
        <div>
        {/* TODO: Modify to user ordersQuery.data */}
        {/* {orders.map((order) => (
            <div key={order.id} className="border-t flex flex-col gap-2 mb-2">
            <h2 className="mt-2">Order ID: {order.id}</h2>
            <p>Total: ${order.total}</p>
            <p>Order Date: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Order Status: {order.status}</p>
            <h3>Items:</h3>
            <ul>
                {order.items.map((item) => (
                <li key={item.id}>
                    {item.name} - ${item.price}
                </li>
                ))}
            </ul>
            </div>
        ))} */}
        </div>
        </div>
    );
};

export default UserOrders;