export class OrderDto {
    readonly id: string;
    readonly productID: string;
    readonly ownerID: string;
    readonly price: number;
    status: string;
}