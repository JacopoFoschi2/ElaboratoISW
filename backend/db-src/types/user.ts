export type UserRole = "master" | "admin" | "user";

export type User = {
    userUsername: string;
    userEmail: string;
    userPassword: string;
    userIconName: string;
    userRole: UserRole;
};