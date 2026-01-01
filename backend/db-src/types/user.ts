export type UserRole = "master" | "admin" | "user";

export type User = {
    userUsername: string;
    userEmail: string;
    userPasswordHash: string;
    userIconName: string | null;
    userRole: UserRole;
};