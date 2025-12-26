DROP DATABASE IF EXISTS PCMASTERRACEDB;

CREATE DATABASE PCMASTERRACEDB
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE PCMASTERRACEDB;

CREATE TABLE categories (
    categoryId INT AUTO_INCREMENT PRIMARY KEY,
    categoryName VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE games (
    gameId INT AUTO_INCREMENT PRIMARY KEY,
    gameName VARCHAR(512) NOT NULL,
    /*
    if you were to ask yourself why I chose 512 here as a character limit, 
    the game with the longest title is currently 336 characters long, 
    so I wanted some leeway in case somebody wanted to use an even longer one
    */
    gameDesc TEXT NOT NULL,
    gameSteamLink VARCHAR(255),
    gameGoGLink VARCHAR(255),
    gameEpicLink VARCHAR(255),
    gameReleaseDate DATE NOT NULL,
    gameSmallBannerName VARCHAR(100) NOT NULL,
    gameSmallBannerBin BLOB NOT NULL,
    gameCoverName VARCHAR(100) NOT NULL,
    gameCoverBin MEDIUMBLOB NOT NULL,
    gameBigBannerName VARCHAR(100) NOT NULL,
    gameBigBannerBin MEDIUMBLOB NOT NULL,
    categoryId INT NOT NULL,
    FOREIGN KEY (categoryId) REFERENCES categories(categoryId)
);

CREATE TABLE users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    userEmail VARCHAR(100) NOT NULL UNIQUE,
    userUsername VARCHAR(50) NOT NULL UNIQUE,
    userPassword VARCHAR(255) NOT NULL,
    userIconBin BLOB,
    userIconName VARCHAR(100),
    userAdminFlag BOOLEAN NOT NULL DEFAULT FALSE,
    userMasterFlag BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE comments (
    commentId INT AUTO_INCREMENT PRIMARY KEY,
    commentBody TEXT NOT NULL,
    commentTimeStamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    gameId INT NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (gameId) REFERENCES games(gameId),
    FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE reviews (
    reviewId INT AUTO_INCREMENT PRIMARY KEY,
    reviewTitle VARCHAR(100) NOT NULL,
    reviewBody TEXT NOT NULL,
    reviewRating TINYINT NOT NULL,
    reviewTimeStamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_reviews (
    reviewId INT NOT NULL,
    userId INT NOT NULL,
    PRIMARY KEY (reviewId, userId),
    FOREIGN KEY (reviewId) REFERENCES reviews(reviewId),
    FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE wishlist (
    gameId INT NOT NULL,
    userId INT NOT NULL,
    PRIMARY KEY (gameId, userId),
    FOREIGN KEY (gameId) REFERENCES games(gameId),
    FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE owned (
    gameId INT NOT NULL,
    userId INT NOT NULL,
    PRIMARY KEY (gameId, userId),
    FOREIGN KEY (gameId) REFERENCES games(gameId),
    FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE game_reviews (
    gameId INT NOT NULL,
    reviewId INT NOT NULL,
    PRIMARY KEY (gameId, reviewId),
    FOREIGN KEY (gameId) REFERENCES games(gameId),
    FOREIGN KEY (reviewId) REFERENCES reviews(reviewId)
);