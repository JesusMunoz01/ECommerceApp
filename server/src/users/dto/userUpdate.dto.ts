export class UserDto {
    email?: string;
    name?: string;
    updated_at: string;
    sname?: "Free" | "Premium" | "Enterprise";
    sid?: string;
    endingDate?: Date;
}