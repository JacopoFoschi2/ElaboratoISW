export type UserRole = "master" | "admin" | "user";

export type User = {
    userUsername: string;
    userEmail: string;
    userRole: UserRole;
};