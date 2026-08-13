# DevTinder Backend

Backend service for **DevTinder**, a developer networking platform built with **Node.js, Express.js and MongoDB**.

It provides REST APIs for authentication, profile management, developer discovery, connection requests, and real-time chat using Socket.IO.

## Features

- 🔐 JWT-based authentication with HTTP-only cookies
- 🔑 Secure password hashing with bcrypt
- 👤 Developer profile management
- 🤝 Connection requests: interested, ignored, accepted and rejected
- 🧑‍💻 Developer feed and connections
- 💬 Real-time private chat with Socket.IO
- ✅ Request validation with express-validator
- 🛡️ Authentication middleware for protected routes
- 🍪 Cookie-based session handling
- 🌍 CORS configuration
- ⚙️ Environment variables with dotenv

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Socket.IO | Real-time chat |
| express-validator | Request validation |
| cookie-parser | Cookie handling |
| CORS | Cross-origin requests |
| dotenv | Environment configuration |
| Nodemon | Development |

The repository's `package.json` defines the current dependencies and `dev`/`start` scripts.

## Project Structure

```text
devTinder/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── middleWares/
│   │   └── auth.js
│   ├── model/
│   │   ├── user.js
│   │   └── connectionRequest.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── profile.js
│   │   ├── request.js
│   │   └── user.js
│   ├── utils/
│   │   ├── socket.js
│   │   └── validation.js
│   └── app.js
├── ApiList.md
├── package.json
└── package-lock.json
```

The current repository organizes backend code into config, middleware, models, routes and utilities under `src`.

## API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Create a new account |
| POST | `/login` | Authenticate a user |
| POST | `/logout` | Logout the authenticated user |

### Profile

| Method | Endpoint | Description |
|---|---|---|
| GET | `/profile/view` | Get authenticated user's profile |
| PATCH | `/updateProfile` | Update profile |
| PATCH | `/profile/password` | Update password |

### Connection Requests

| Method | Endpoint | Description |
|---|---|---|
| POST | `/request/send/interested/:userId` | Send interested request |
| POST | `/request/send/ignored/:userId` | Ignore a developer |
| POST | `/request/send/accepted/:requestId` | Accept a request |
| POST | `/request/send/rejected/:requestId` | Reject a request |
| POST | `/request/review/:status/:requestId` | Review a request |

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/user/requests` | Get received requests |
| GET | `/user/connections` | Get connections |
| GET | `/feed` | Get developer profiles |

These endpoints are based on the repository's current `ApiList.md`.

## Real-Time Chat

Socket.IO powers the real-time chat system.

```text
User A
  │
  │ sendMessage
  ▼
Socket.IO Server
  │
  │ private room
  ▼
User B
  │
  └── messageReceived
```

The backend generates a private room ID from the two user IDs using SHA-256. Users join rooms through `joinChat`, and messages are emitted through `sendMessage` and received through `messageReceived`.

## Authentication Flow

```text
Signup / Login
      ↓
Validate credentials
      ↓
Hash / verify password
      ↓
Generate JWT
      ↓
HTTP-only cookie
      ↓
Protected API request
      ↓
Auth middleware
      ↓
Verify JWT
      ↓
Identify logged-in user
```

The authentication routes use bcrypt and JWT, while the authentication middleware reads the token from cookies and verifies it with `SECRET_KEY`.

## Getting Started

### 1. Clone

```bash
git clone https://github.com/abhisheknishad345/devTinder.git
cd devTinder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env`

```env
DB_URL=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
PORT=5500
```

`DB_URL` is used for the MongoDB connection and `SECRET_KEY` is used for JWT verification.

> Never commit real database credentials or secrets to GitHub.

### 4. Development

```bash
npm run dev
```

### 5. Production

```bash
npm start
```

The repository currently defines `npm run dev` with Nodemon and `npm start` with Node. citeturn1view0

## Database

MongoDB is accessed through Mongoose. The backend currently contains models for:

- Users
- Connection requests

The database connection reads its MongoDB URI from `DB_URL`.

## Backend Architecture

```text
React Frontend
      │
      │ REST API
      ▼
Express.js
      │
      ├── Auth Routes
      ├── Profile Routes
      ├── Request Routes
      └── User Routes
              │
              ▼
      Authentication Middleware
              │
              ▼
          Mongoose
              │
              ▼
           MongoDB

Socket.IO
    │
    ▼
Real-Time Chat
```

## API Testing

You can test the REST APIs with **Postman**.

Recommended flow:

```text
Signup
  ↓
Login
  ↓
Profile
  ↓
Developer Feed
  ↓
Connection Request
  ↓
Accept / Reject
  ↓
Real-Time Chat
```

## Documentation

- [`ApiList.md`](./ApiList.md) — API endpoint list
- [`src/routes`](./src/routes) — Route handlers
- [`src/model`](./src/model) — Database models
- [`src/middleWares`](./src/middleWares) — Authentication middleware
- [`src/utils/socket.js`](./src/utils/socket.js) — Socket.IO implementation

## Author

**Abhishek Nishad**

GitHub: https://github.com/abhisheknishad345

## License

This project is for educational and portfolio purposes.
