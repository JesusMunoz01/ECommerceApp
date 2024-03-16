export class UserDto {
    email?: string;
    name?: string;
    role?: "Customer" | "Seller" | "Business";
    updated_at: string;
}