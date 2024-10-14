import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { BiArrowBack } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";

const OrderPage = () => {
    const { id } = useParams()
    const { getAccessTokenSilently } = useAuth0()

    const orderQuery = useQuery({
        queryKey: ["order", id],
        queryFn: async () => {
            const token = await getAccessTokenSilently()
            const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              const data = await response.json()
              console.log(data)
              return data
        }
    })

    if(orderQuery.isLoading) return <h1>Loading...</h1>

    return (
        <div className="flex flex-col justify-center items-center relative">
            <Link to={"/settings"} className="self-start justify-self-start text-3xl md:absolute md:top-0"><BiArrowBack /></Link>
            <h1 className="relative">Your Order</h1>
            <br />
            <h2 className="text-xl pb-2 border-b-2 border-dashed md:w-1/3">Order ID: {orderQuery.data.order.id}</h2>
            <br />
            <div className="flex flex-col gap-2 text-lg md:w-1/3">
                <h2>Order Details</h2>
                <h3>Status: {orderQuery.data.order.status}</h3>
                <h3>Total: ${orderQuery.data.order.total}</h3>
                <h3>Date Ordered: {orderQuery.data.order.orderDate}</h3>
                <h3>Items:</h3>
                <ul className="pl-2 overflow-auto h-48 bg-neutral-700 rounded">
                    {orderQuery.data.order.items.map((item:any, index:number) => (
                        <li key={index}>{index + 1}: (Qt: {item.quantity}) {item.productName} - ${item.productPrice}</li>
                    ))}
                </ul>
                <div className="w-full">
                    <button className="w-1/2">Return</button>
                    <button className="w-1/2">Edit</button>
                </div>
            </div>
        </div>
    )
}

export default OrderPage;