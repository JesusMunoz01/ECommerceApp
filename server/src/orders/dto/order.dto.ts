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
    productName: string;
    productPrice: number;
}

export class StripeItem {
    id: number;
    subtotal: number;
    quantity: number
}

export interface OrderDetails extends OrderDto {
    id: number;
    createdAt: Date;
}