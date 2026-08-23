# PROMPTS.md

This file contains the real prompts I used when working with ChatGPT during the development of this project.

---

## Prompt 1 — Backend Development

> Build the backend for my Car Dealership Inventory System using Node.js, Express.js, MongoDB and Mongoose.
>
> I need:
> - User registration and login
> - JWT authentication
> - User and admin roles
> - Vehicle CRUD operations
> - Vehicle search
> - Purchase functionality
> - Stock management
> - Admin authorization
> - Error handling
>
> Give me the complete folder structure and required code.

---

## Prompt 2 — User Authentication

> Give me the complete backend code for user registration and login using Express, MongoDB, bcrypt and JWT.
>
> Support `user` and `admin` roles and protect admin-only APIs using authentication and authorization middleware.

---

## Prompt 3 — Vehicle Model

> Give me the complete Mongoose Vehicle model for my Car Dealership Inventory System.
>
> Include:
> - Make
> - Model
> - Year
> - Price
> - Category
> - Description
> - Image
> - Stock
>
> Include proper validation.

---

## Prompt 4 — Vehicle CRUD

> Give me the complete Express backend code for vehicle CRUD operations:
> - Add vehicle
> - Get vehicles
> - Get vehicle by ID
> - Update vehicle
> - Delete vehicle
>
> Only admins should be allowed to add, update and delete vehicles.

---

## Prompt 5 — Vehicle Search

> Give me the complete backend and frontend code for vehicle search.
>
> Users should be able to search vehicles by make, model, category and year.
>
> Make the search case-insensitive and ensure it correctly filters the vehicles.

---

## Prompt 6 — Purchase and Stock

> Give me the complete backend and frontend code for vehicle purchase and stock management.
>
> Requirements:
> - Authenticated users can purchase vehicles.
> - Stock decreases after a successful purchase.
> - Users cannot purchase vehicles when stock is zero.
> - Stock should be updated in the frontend after purchase.

---

## Prompt 7 — Admin Restock

> Give me the complete backend and React code for vehicle restocking.
>
> Only admins should be able to increase vehicle stock.
>
> Update the inventory after successful restocking.

---

## Prompt 8 — Frontend Development

> My backend is completed and now I need to build the frontend for my Car Dealership Inventory System using React, Vite and Tailwind CSS.
>
> I need:
> - Registration page
> - Login page
> - Vehicle dashboard
> - Vehicle search
> - Purchase functionality
> - Stock display
> - Admin controls
> - Logout
> - Responsive and modern UI
>
> The frontend should connect to my existing Node.js and Express backend APIs.
>
> Guide me step-by-step and provide the required code.

---

## Prompt 9 — React App Implementation

> Give me the complete App.jsx code for my Car Dealership Inventory System.
>
> It should include:
> - Registration
> - Login
> - JWT authentication
> - Vehicle listing
> - Vehicle search
> - Purchase functionality
> - Stock display
> - Admin vehicle management
> - Logout
>
> Use my existing backend APIs and Tailwind CSS.

---

## Prompt 10 — Authentication and Protected Routes

> Give me the complete React authentication code using JWT.
>
> Store the token, restore authentication after refresh, detect the user role, provide logout functionality and protect admin routes.
>
> Normal users must not be able to access admin functionality.

---

## Prompt 11 — Admin Dashboard

> Give me the complete React code for the admin dashboard.
>
> The admin should be able to:
> - Add vehicles
> - Update vehicles
> - Delete vehicles
> - Restock vehicles
>
> Normal users must not see or access these controls.

---

## Prompt 12 — API Integration

> Connect my React frontend to my existing Express backend.
>
> Give me the required Axios or fetch code with:
> - API base URL
> - JWT authorization headers
> - Request handling
> - Response handling
> - Error handling

---

## Prompt 13 — Frontend Styling

> Give me the required index.css and Tailwind CSS styling for my React Car Dealership Inventory System.
>
> I want a clean, modern and responsive interface for desktop and mobile devices.

---

## Prompt 14 — Search Functionality Issue

> I logged in using the user role and tried to search for a vehicle, but the search is not filtering the vehicles correctly.
>
> Help me identify the problem and fix the search functionality without breaking the existing application.
>
> Check both the React frontend and Express backend search logic.

---

## Prompt 15 — Admin Functionality Issue

> In the admin dashboard there is no button to add a vehicle.
>
> Help me fix the admin UI and make sure the admin can:
> - Add vehicles
> - Update vehicles
> - Delete vehicles
> - Restock vehicles
>
> Normal users must not have access to these controls.
>
> Check both frontend role handling and backend authorization.

---

## Prompt 16 — JWT/API Debugging

> My frontend is receiving 401 or 403 errors from the backend.
>
> Check the JWT token, Authorization header, authentication middleware, admin authorization and API routes.
>
> Give me the corrected code without breaking the existing application.

---

## Prompt 17 — Stock Update Issue

> A vehicle purchase succeeds in the backend, but the stock displayed in the React frontend is not updating.
>
> Find the problem and provide the corrected backend and frontend code so the inventory updates immediately after purchase.

---

## Prompt 18 — Complete Application Debugging

> I will provide my complete backend and frontend code.
>
> Review the application and find problems related to:
> - API integration
> - JWT authentication
> - Authorization
> - Vehicle CRUD
> - Search
> - Purchase
> - Stock management
> - Admin functionality
> - React UI
>
> Give me the corrected code file-by-file.

---

## Prompt 19 — Testing

> Give me test cases for my complete Car Dealership Inventory System.
>
> Test:
> - User registration
> - Login
> - Invalid login
> - JWT authentication
> - User authorization
> - Admin authorization
> - Vehicle CRUD
> - Vehicle search
> - Vehicle purchase
> - Stock management
> - Admin restocking
> - Unauthorized access

---

## Prompt 20 — Final Project Review

> Review my complete Car Dealership Inventory System.
>
> Verify that the backend and frontend are fully connected and that all required features work correctly:
> - Registration
> - Login
> - JWT authentication
> - User and admin roles
> - Vehicle listing
> - Search
> - Purchase
> - Stock management
> - Admin CRUD
> - Restocking
> - Responsive UI
>
