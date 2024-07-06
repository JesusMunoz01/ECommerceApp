import { useEffect, useState } from "react";

type Order = {
    id: string;
    createdAt: string;
    status: string;
    items: { id: string; name: string; price: number }[];
    total: number;
};

const testOrders: Order[] = [
    {
        id: "1",
        createdAt: "2021-09-01T12:00:00",
        status: "Delivered",
        items: [
            { id: "1", name: "Item 1", price: 10 },
            { id: "2", name: "Item 2", price: 20 },
        ],
        total: 30,
    },
    {
        id: "2",
        createdAt: "2021-09-02T12:00:00",
        status: "Shipped",
        items: [
            { id: "3", name: "Item 3", price: 30 },
            { id: "4", name: "Item 4", price: 40 },
        ],
        total: 70,
    },
];

const UserOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        // Fetch orders from API
        setOrders(testOrders);
    }, []);
    
    return (
        <div className="flex flex-col gap-1 h-full">
        <h1 className="mb-2 min-h-20 text-3xl md:text-6xl">Your Orders</h1>
        <div>
        {orders.map((order) => (
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
        ))}
        </div>
        </div>
    );
};

export default UserOrders;