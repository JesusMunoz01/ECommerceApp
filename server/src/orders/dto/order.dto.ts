export class OrderDto {
    userID: string;
    total: number;
    status: "pending" | "completed" | "cancelled";
    paymentMethod: string;
    shippingAddress: string;
}

export class OrderItemDto {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
}