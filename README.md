# School Management System - MEAN Stack

This is a simple school management system developed using the MEAN Stack (MongoDB, Express.js, Angular, Node.js). It features role-based access control for Admins, Teachers, and Students.

## Features

### Admin
- Manage (CRUD) Users (Teachers, Students)
- Manage (CRUD) Grades
- Manage (CRUD) Subjects
- Assign Students to a Grade
- Assign Teachers to a Grade

### Teacher
- View a list of assigned students
- Assign marks to students for any subject

### Student
- View personal profile and assigned grade
- View all marks given by teachers

## Project Structure

### Backend (`/backend`)
- **`config`**: Contains database connection logic (`db.js`).
- **`controllers`**: Contains the business logic for API endpoints.
- **`middleware`**: Contains authentication and authorization middleware (JWT, role checks).
- **`models`**: Defines the Mongoose schemas for the database collections.
- **`routes`**: Defines the API routes and maps them to controller functions.
- **`utils`**: Contains utility functions like the seeder script and token generator.
- **`server.js`**: The entry point for the Express application.

### Frontend (`/frontend`)
- **`src/app/admin`**: Components for the Admin dashboard (Manage Users, Grades, Subjects).
- **`src/app/teacher`**: Components for the Teacher dashboard (View Students, Assign Marks).
- **`src/app/student-dashboard`**: Component for the Student dashboard.
- **`src/app/services`**: Services for handling API communication (`admin.service.ts`, `teacher.service.ts`, etc.).
- **`src/app/guards`**: Contains the route guard for role-based access control.
- **`src/app/login`**: The main login component.

## Local Setup

### Prerequisites
- Node.js and npm
- Angular CLI
- MongoDB (local instance or a cloud service like MongoDB Atlas)

### Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000


(Optional) Seed the database with initial roles and an admin user. This will wipe existing data in the collections.

Generated bash
npm run data:import
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Run the server:

Generated bash
npm run server
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

The backend will be running on http://localhost:5000.

Frontend Setup

Open a new terminal and navigate to the frontend directory: cd frontend

Install dependencies: npm install

Run the development server:

Generated bash
ng serve
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

The application will be available at http://localhost:4200.

Default Credentials

If you used the seeder script, you can log in with the default admin account:

Email: admin@gmail.com

Password: 123456

Deployment (Render.com)

This project is set up to be easily deployed on Render using two separate services.

Backend - Web Service

Repository: Your GitHub repository

Root Directory: backend

Build Command: npm install

Start Command: npm start

Environment Variables:

MONGO_URI: Your production MongoDB Atlas connection string.

JWT_SECRET: A strong, unique secret for your production environment.

Frontend - Static Site

Repository: Your GitHub repository

Root Directory: frontend

Build Command: npm install && npm run build

Publish Directory: frontend/dist/school-ui

Important: Before deploying the frontend, ensure that the apiUrl in frontend/src/environments/environment.prod.ts is set to your deployed backend URL.

Technologies Used

Frontend: Angular, Angular Material, RxJS

Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Authentication: JSON Web Tokens (JWT)

Generated code
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END
