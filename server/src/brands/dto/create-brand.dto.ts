export class CreateBrandDto {
    name: string;
    description: string;
    image: string;
    products: number[];
    createdAt: Date;
    updatedAt: Date;
}
