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
