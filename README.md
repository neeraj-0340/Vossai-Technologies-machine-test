# Task Management System

A simple and responsive MERN stack application designed to manage personal tasks. It supports registration, login, and full CRUD task flows alongside status filtering, search querying, and pagination.

# Features

- User Registration
- User Login
- JWT Authentication
- Create Task
- View Tasks
- Update Task
- Delete Task
- Search
- Filter by Status
- Pagination

# Tech Stack

Frontend:
- React.js
- CSS
- Axios

Backend:
- Node.js
- Express.js

Database:
- MongoDB
- Mongoose

# Installation

# Backend Setup
1. Navigate to the backend folder:

   cd backend

2. Install the required Node packages:

   npm install

3. Add a `.env` file in the backend root directory (using the variables listed below).
4. Start the backend development server:

   npm run dev

### Frontend Setup
1. Navigate to the frontend folder:

   cd frontend

2. Install the required Node packages:

   npm install

3. Start the frontend development server:

   npm run dev

# Environment Variables

Define the following environment variables in a `.env` file inside the `backend` directory:

.env

PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=10d


# API Endpoints

POST /api/register
POST /api/login
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
