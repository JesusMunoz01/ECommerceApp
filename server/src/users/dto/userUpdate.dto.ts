export class UserDto {
    email?: string;
    name?: string;
    updated_at: string;
    plan?: "Free" | "Premium" | "Enterprise";
    sid?: string;
    endingDate?: Date;
}