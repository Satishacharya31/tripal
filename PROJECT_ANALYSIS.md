# Nepal Guide Connect: Project Analysis & Architecture

## Project Overview
Nepal Guide Connect is a full-stack web platform designed to connect tourists with local guides for personalized tours in Nepal. The system streamlines the process of requesting, assigning, and managing guided tours, with dedicated dashboards and features for tourists, guides, and administrators.

---

## Key Features
- **Authentication & Authorization**: Secure JWT-based login with role-based access (Tourist, Guide, Admin).
- **User Management**: Profile creation and management for all roles, including guide specialties and experience.
- **Tour Requests**: Tourists can submit requests specifying destinations, interests, and requirements.
- **Guide Assignment**: Admins assign guides to requests based on specialties, availability, and preferences.
- **Dashboards**:
  - **Tourist Dashboard**: Submit/view requests, see assigned guides, and track tour status.
  - **Guide Dashboard**: View assignments, update tour progress, and contact tourists.
  - **Admin Dashboard**: Manage users, requests, guides, and destinations.
- **Notifications**: Real-time alerts for assignments, status changes, and important updates.
- **Destination Management**: CRUD operations for destinations (admin only).
- **Review & Rating**: Tourists can review and rate guides after tour completion.
- **Security**: Rate limiting, CORS, input validation, and role-based access control.

---

## System Architecture

```mermaid
graph TD
  A[Tourist] -- Requests Tour --> B[Backend API]
  B -- Assigns Guide --> C[Guide]
  C -- Updates Status --> B
  B -- Notifies --> A
  B -- Notifies --> C
  D[Admin] -- Manages --> B
  A -- Reviews Guide --> B
  B -- Stores Data --> E[(MongoDB)]
  F[Frontend (React)] -- API Calls --> B
```

---

## Main Components

### Frontend (React + Vite + Tailwind)
- **Pages**: TouristDashboard, GuideDashboard, AdminDashboard, Login/Register, Profile, RequestForm, etc.
- **Context**: AuthContext, DataContext for global state and API integration.
- **Components**: Navbar, Notification Bell, Modals, Cards, etc.
- **Routing**: Role-based navigation and protected routes.

### Backend (Node.js + Express + MongoDB)
- **Models**: User, Request, Destination, Notification
- **Controllers**: Auth, Guide, Request, Notification, Destination
- **Routes**: RESTful API endpoints for all resources
- **Middleware**: Auth, role restriction, error handling
- **Notifications**: Real-time (polling or push)

---

## User Roles & Flows

### Tourist
- Registers/logs in
- Creates tour requests (selects destinations, interests, etc.)
- Views assigned guide and tour status
- Contacts guide and leaves reviews

### Guide
- Registers/logs in
- Sets up profile (languages, specialties, experience)
- Views assigned tours and updates status (assigned → in-progress → completed)
- Contacts tourists

### Admin
- Manages users, guides, destinations, and requests
- Assigns guides to requests
- Monitors platform activity

---

## Data Flow Example
1. **Tourist** submits a request → **Backend** stores it → **Admin** assigns a guide → **Guide** is notified and updates status → **Tourist** is notified of progress → **Tourist** reviews guide after completion.

---

## Technologies Used
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Auth**: JWT, Passport.js
- **Security**: Helmet, CORS, bcryptjs, rate limiting

---

## Conclusion
Nepal Guide Connect is a robust, role-based tourism platform that efficiently matches tourists with local guides, streamlines tour management, and provides real-time communication and notifications. Its modular architecture, clear separation of concerns, and strong security practices make it a scalable and maintainable solution for the travel industry.
