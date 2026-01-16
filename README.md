# PCMASTERRACEDB

## [Desing in figma](https://www.figma.com/design/i4GJXy1o7o1REjxNKhDrOZ/Project-PcMasterRaceDB?node-id=0-1&t=7vQWqPAiKoI57x35-1)

## Crud naming convention

- Create: create for new entities, add for new relations
- Read: list for collections, get for single object
- Update: update
- Delete: delete

## Backend Apis

### Authentication

- Create:
  - /api/auth/register
- Read:
  - /api/auth/profile
  - /api/users/exists/username/:username
  - /api/users/exists/email/:email
- Update:
  - /api/auth/change-password

- /api/auth/login
- /api/auth/logout

### Games

- Create:
  - /api/games
- Read:
  - /api/games/rating
  - /api/games/release
  - /api/games/:genreId
  - /api/games/as-you-type/:partialName
  - /api/games/matching/:partialName
  - /api/game/:gameId
- Update:
  - /api/games/:gameId
- Delete:
  - /api/games/:gameId

### User

- Read:
  - /api/users
  - /api/user
- Update:
  - /api/user
- Delete:
  - /api/user/:userId

### Categories

- Create:
  - /api/categories
- Read:
  - /api/categories
- Update:
  - /api/categories/:categoryId
- Delete:
  - /api/categories/:categoryId

### Game Categories

- Create:
  - /api/game-categories
- Read:
  - /api/game-categories/:gameId
- Update:
  - /api/game-categories
- Delete:
  - /api/game-categories/:gameId/:categoryId

### Owned

- Create:
  - /api/owned/:gameId
- Read:
  - /api/owned
  - /api/owned/:gameId
- Delete:
  - /api/owned/:gameId

### Reviews

- Create:
  - /api/reviews/:gameId
- Read:
  - /api/reviews/game/:gameId
  - /api/reviews/user
- Update:
  - /api/reviews/:gameId
- Delete:
  - /api/reviews/:gameId

### Forum

- Create:
  - /api/games/:gameId/comments
- Read:
  - /api/forums
  - /api/forums/as-you-type/:partialName
  - /api/forums/matching/:partialName
  - /api/games/:gameId/comments
  - /api/games/:gameId/banner
- Update:
  - /api/comments/:commentId
- Delete:
  - /api/comments/:commentId

### Wishlist

- Create:
  - /api/wishlist/:gameId
- Read:
  - /api/wishlist
- Update:
  - /api/wishlist/:gameId
- Delete:
  - /api/wishlist/:gameId
