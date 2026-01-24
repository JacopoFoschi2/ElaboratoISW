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
  userId: number;
  userEmail: string;
  userUsername: string;
  userRole: string;

  userIconBin?: {
    type: 'Buffer';
    data: number[];
  };

  userIconName?: string;
}