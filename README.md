
---

# Customer Support Request System - Backend

This repository contains the backend code for the Customer Support Request System. It provides RESTful APIs for user authentication, ticket management, comments, and roles.

## Implementation

The backend is implemented using Node.js, Express.js, and MongoDB as the database. It follows a modular structure with controllers, services, and models for each entity.

## API Documentation

API documentation for the backend is available using Swagger. You can access the documentation by running the server and visiting the following URL in your browser:

```
http://localhost:8085/api-docs
```

The Swagger documentation provides a user-friendly interface to visualize and interact with the API. It includes details about each endpoint, request bodies, response schemas, and more.

## Endpoints

The following are the main endpoints provided by the backend API:

- **Authentication:**
  - POST /api/auth/signup: Sign up a new user.
  - POST /api/auth/login: Log in an existing user.
  - POST /api/auth/forgot-password: Request a password reset email.
  - POST /api/auth/reset-password: Reset the user's password.

- **Tickets:**
  - POST /api/tickets: Create a new ticket.
  - GET /api/tickets: Get all tickets.
  - GET /api/tickets/:id: Get a specific ticket.
  - GET /api/tickets/comment/:id: Get comments for specific ticket.
  - GET /api/tickets/closed: Get tickets closed within date range.
  - PUT /api/tickets/:id: Update a ticket.
  - DELETE /api/tickets/:id: Delete a ticket.

- **Comments:**
  - POST /api/comments: Add a new comment to a ticket.
  - GET /api/comments: Get all comments.
  - GET /api/comments/:id: Get a specific comment.
  - PUT /api/comments/:id: Update a comment.
  - DELETE /api/comments/:id: Delete a comment.

- **Roles:**
  - POST /api/role: Create a new role.
  - GET /api/role: Get all roles.
  - GET /api/role/:id: Get a specific role.
  - PUT /api/role/:id: Update a role.
  - DELETE /api/role/:id: Delete a role.

## Technology Stack

The backend is built using the following technologies:

- Node.js
- Express.js
- MongoDB
- Mongoose (Object Data Modeling for MongoDB)
- Swagger (API Documentation)

## How to Set Up the Project

Follow these steps to set up and run the backend:

1. Clone this repository to your local machine.

2. Install the dependencies:

```
npm install
```

3. Set up the MongoDB connection string in the `.env` file.

4. Seed roles to the database:

```
npm run seed:roles
```

5. Build the TypeScript code:

```
npm run build
```

6. Start the server:

```
npm start
```

7. Access the API documentation at `http://localhost:3000/api-docs`.

## Commands/Scripts

- Start the server:

```
npm start
```

- Run the development server (with nodemon):

```
npm run dev
```

- Build the TypeScript code:

```
npm run build
```

- Run tests:

```
npm test
```

---

Please note that the API documentation (Swagger) will be available at the specified URL only when the server is running. Make sure to start the server before accessing the API documentation.