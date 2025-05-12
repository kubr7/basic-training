# SaySomething API

A social media-style backend built with NestJS, providing user authentication, friend request features, and post creation with likes functionality.

---

## Tech Stack

- **NestJS**: Progressive Node.js framework for scalable server-side applications
- **TypeORM**: ORM for working with PostgreSQL
- **PostgreSQL**: Relational database
- **JWT**: JSON Web Token-based authentication
- **bcrypt**: Secure password hashing
- **class-validator**: Validation for DTOs and request bodies

---

## Project Structure Overview
src/
│
├── auth/                       // Login, register, JWT
├── friends/                    // Friends entity, Send Request, Accept request, Reject
├── posts/                      // Post entity, creation, likes, listing
├── users/                      // User entity, friend logic
├── app.module.ts
├── main.ts



## JWT Authentication

- Protected routes use: `@UseGuards(JwtAuthGuard)`
- Extract user from JWT using: `@Request()` is a NestJS decorator (alias for `@Req()`) that injects the full request object. `req.user` is populated automatically by `Passport` if the request passes through an `authentication guard using the JWT strategy`.



---

## API Endpoints Summary

### App

| Method | Endpoint      | Description                 |
|--------|---------------|-----------------------------|
| GET    | `/`           | SaySomething API base route |

---

### User

| Method | Endpoint                         | Description                       |
|--------|----------------------------------|-----------------------------------|
| GET    | `/users`                         | Get all users                     |
| GET    | `/users/{id}`                    | Get user by ID                    |
| GET    | `/users/by-email/{email}`        | Get user by email                 |
| GET    | `/users/by-username/{username}`  | Get user by username              |
| GET    | `/users/{username}/friends`      | Get user's friends by username    |

---

### Auth

| Method | Endpoint         | Description                |
|--------|------------------|----------------------------|
| POST   | `/auth/register` | Register a new user        |
| POST   | `/auth/login`    | Login a user (returns JWT) |
| POST   | `/auth/logout`   | Logout a user              |

---

### Posts

| Method | Endpoint                                  | Description                  |
|--------|-------------------------------------------|------------------------------|
| POST   | `/posts/create`                           | Create a new post            |
| POST   | `/posts/like/{postId}`                    | Like a post                  |
| GET    | `/posts`                                  | Get all posts                |
| GET    | `/posts/{username}`                       | Get posts by username        |

---

### Friends

| Method | Endpoint                                  | Description                  |
|--------|-------------------------------------------|------------------------------|
| POST   | `/friends/request/{receiverUsername}`     | Send a friend request        |
| POST   | `/friends/accept/{senderUsername}`        | Accept a friend request      |
| POST   | `/friends/reject/{senderUsername}`        | Reject a friend request      |
| GET    | `/friends/friend-requests/{username}`     | Get pending friend requests  |
| GET    | `/friends/friends/{username}`             | Get a user's friends         |

---

## Schemas (DTOs)

- **GetAllUsersDto**
- **User**
- **UserFriendDto**
- **RegisterDto**
- **LoginDto**
- **LogoutDto**
- **CreatePostDto**
- **LikePostDto**
- **SendFriendRequestDto**
- **AcceptFriendRequestDto**
- **RejectFriendRequestDto**

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL

### Installation

```bash
git clone https://github.com/your-username/saysomething-api.git
cd saysomething-api
npm install


---

### Run the Application
## `npm run start:dev`

### Build for Production
## `npm run build`