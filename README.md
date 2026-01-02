# PCMASTERRACEDB

## Crud naming convention

- Create: create for new entities, add for new relations
- Read: list for collections, get for single object
- Update: update
- Delete: delete

## Backend Apis

### Games

- Create:
  - /api/games
- Read:
  - /api/games/rating
  - /api/games/release
  - /api/games/:genreId
- Update:
  - /api/games/:gameId
- Delete:
  - /api/games/:gameId

### User

- Create:
  - /api/users
- Read:
  - /api/users
  - /api/users/:userId
  - /api/users/exists/username/:username
  - /api/users/exists/email/:email
- Update:
  - /api/users/:userId
  - /api/users/:userId/password
- Delete:
  - /api/users/:userId

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
  - /api/owned/:userId/:gameId
- Read:
  - /api/owned/:userId
- Update:
  - /api/owned/:userId/:gameId
- Delete:
  - /api/owned/:userId/:gameId

### Reviews

- Create:
  - /api/reviews/:gameId/:userId
- Read:
  - /api/reviews/game/:gameId
  - /api/reviews/user/:userId
- Update:
  - /api/reviews/:gameId/:userId
- Delete:
  - /api/reviews/:gameId/:userId

### Forum

- Create:
  - /api/games/:gameId/comments
- Read:
  - /api/forums
  - /api/games/:gameId/comments
- Update:
  - /api/comments/:commentId
- Delete:
  - /api/comments/:commentId

### Wishlist

- Create:
  - /api/wishlist/:userId/:gameId
- Read:
  - /api/wishlist/:userId
- Update:
  - /api/wishlist/:userId/:gameId
- Delete:
  - /api/wishlist/:userId/:gameId
