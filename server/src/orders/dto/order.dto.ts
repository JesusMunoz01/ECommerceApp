export class OrderDto {
    userId: string;
    total: number;
    status: "Pending" | "Completed" | "Cancelled";
    paymentMethod: string;
    shippingAddress: string;
}

export class OrderItemDto {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
}

export class StripeItem {
    id: number;
    subtotal: number;
    quantity: number
}

export interface CompleteOrderDto extends OrderDto, OrderItemDto {}