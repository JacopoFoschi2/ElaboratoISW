export interface Game {
    gameId: number | string;
    gameName?: string;
    gameTitle?: string;
    gameCoverBin?: {
        data: number[];
    };
    gameSmallBannerBin?: {
        data: number[];
    };
    rating?: number;
}

export interface Category {
    categoryId: number;
    categoryName: string;
}

export interface User {
  id: number
  username: string
    email: string
  role: string
  userIconBin?: { data: number[] }
}