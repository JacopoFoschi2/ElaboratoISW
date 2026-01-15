export type UserRole = "master" | "admin" | "user";

export interface User {
    userUsername: string;
    userEmail: string;
    userRole: UserRole;
};