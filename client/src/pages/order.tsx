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
              console.log(response.json())
              return response.json()
        }
    })

    const tempData = {
        id,
        date: Date.now(),
        items: [{id:1, name: "item"}, {id:2, name: "item"}]
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <h1>Your Order</h1>
            <h2>ID: {tempData.id}</h2>
            <div>
                <h2>Order Details</h2>
                {/* <h3>Status: {}</h3> */}
                <h3>Items:</h3>
                <ul>
                    {tempData.items.map((item, index) => (
                        <li>{index + 1}: {item.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default OrderPage;