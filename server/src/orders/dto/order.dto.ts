export class OrderDto {
    readonly id: string;
    readonly productsID: string[];
    readonly ownerID: string;
    readonly price: number;
    status: "pending" | "completed" | "cancelled";
}