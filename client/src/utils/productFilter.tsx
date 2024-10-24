import { Product } from "../components/Products/productCard";
import { Orders } from "../components/User/UserOrders";

export const productFilter = (data: Product[], search: string) => {
    return data.filter((product: Product) => product.name.toLowerCase().includes(search.toLowerCase()));
}

export const orderFilter = (data: Orders[], search: string) => {
    return data.filter((order: Orders) => order.id.toString().includes(search.toLowerCase()));
}