import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

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
        <div className="flex flex-col justify-center items-center">
            <h1>Your Order</h1>
            <h2>ID: {orderQuery.data.order[0].id}</h2>
            <div>
                <h2>Order Details</h2>
                <h3>Status: {orderQuery.data.order[0].status}</h3>
                <h3>Total: ${orderQuery.data.order[0].total}</h3>
                <h3>Date Ordered: {orderQuery.data.order[0].createdAt}</h3>
                <h3>Items:</h3>
                <ul>
                    {orderQuery.data.order.map((item:any, index:number) => (
                        <li>{index + 1}: (Qt: {item.quantity}) {item.productName} - ${item.productPrice}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default OrderPage;