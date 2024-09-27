import { Orders } from "../components/User/UserOrders";

export const productFilter = (data: any, search: string) => {
    return data.filter((product: any) => product.name.toLowerCase().includes(search.toLowerCase()));
}

export const orderFilter = (data: Orders[], search: string) => {
    return data.filter((order: Orders) => order.id.toString().includes(search.toLowerCase()));
}