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
  - /api/auth/register   Creates new user
- Read:
  - /api/auth/profile    Gets user profile from current session, doesn't get complete profile
  - /api/users/exists/username/:username    Checks if username exists
  - /api/users/exists/email/:email    Checks if email exists
- Update:
  - /api/auth/change-password    Changes password of currently log user after checking if it's really them by their current password

- /api/auth/login
- /api/auth/logout

### User

- Read:
  - /api/users    List of every user, superadmin privilege needed
  - /api/user     Gets profile of currently logged in user from DB, userImage included
- Update:
  - /api/user     Changes image and nickaname of currently logged in user
- Delete:
  - /api/user/:userId    Deletes user, can be used to remove self's account or by superadmin to romove another's

### Games

- Create:
  - /api/games    Creates game, superadmin only
- Read:
  - /api/games/rating    Lists all games ordered by rating
  - /api/games/release    Lists all games ordered by release
  - /api/games/:genreId    Lists all games of genre
  - /api/games/as-you-type/:partialName    Lists partial list of games matching with what you're typing
  - /api/games/matching/:partialName    List all the games matching with what you searched
  - /api/game/:gameId    Gets details of single game
- Update:
  - /api/games/:gameId    Updates info of game, superadmin only
- Delete:
  - /api/games/:gameId    Deletes game, superadmin only

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
  - /api/game-categories/:gameId    Reads all game categories of game
- Update:
  - /api/game-categories
- Delete:
  - /api/game-categories/:gameId/:categoryId

### Owned

- Create:
  - /api/owned/:gameId
- Read:
  - /api/owned    Lists all owned of user
  - /api/owned/:gameId    Checks if the game is owned by logged in user
- Delete:
  - /api/owned/:gameId

### Wishlist

- Create:
  - /api/wishlist/:gameId
- Read:
  - /api/wishlist    Lists all wishlisted of user
- Update:
  - /api/wishlist/:gameId   Checks if the game is wishlisted by logged in user
- Delete:
  - /api/wishlist/:gameId

### Reviews

- Create:
  - /api/reviews/:gameId
- Read:
  - /api/reviews/game/:gameId    Lists all reviews of game and tries to put review of user on top if logged
  - /api/reviews/user    Lists all reviews of user
- Update:
  - /api/reviews/:gameId    Updates review of logged user of said game, admins cannot modify reviews of others
- Delete:
  - /api/reviews/:gameId    Deletes review of logged user of said game, admins cannot delete reviews of others

### Forum

- Create:
  - /api/games/:gameId/comments
- Read:
  - /api/forums    Lists all forums present
  - /api/forums/as-you-type/:partialName    Lists partial amount of forums matching with what you're typing
  - /api/forums/matching/:partialName    Lists all forums matching with what was typed
  - /api/games/:gameId/comments    Lists all comments of game
  - /api/games/:gameId/banner    Gets banner of forum
- Update:
  - /api/comments/:commentId   Updates comment, admins can't modify comments of others
- Delete:
  - /api/comments/:commentId   Deletes comment, admins can delete comments of others
