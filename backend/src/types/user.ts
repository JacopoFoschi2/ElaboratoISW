export type UserRole = "master" | "admin" | "user";

export interface User {
  userId: number;
  userUsername: string;
  userEmail: string;
  userRole: UserRole;
  userIconBin?: string;
  userIconName?: string;
}
