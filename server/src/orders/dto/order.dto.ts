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