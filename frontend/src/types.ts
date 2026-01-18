export interface Game {
    id: number;
    title: string;
    description: string;
    raiting: number;
    coverImage:string;
    stores: string[];
}

export interface User {
  id: number
  username: string
    email: string
  role: "admin" | "user"
}