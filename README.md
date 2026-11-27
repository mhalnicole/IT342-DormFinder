# DormFinder: Student Boarding House and Dormitory Listing System
### IT342 - Systems Integration and Architecture 1 | Cebu Institute of Technology - University
**Project Increment 2: User Profile and Password Management**  
**Author:** Mhalia Nicole P. Paton-og (`mhals`)  
**Academic Term:** First Semester, A.Y. 2026-2027  
**Official Completion Report:** [`docs/Increment-2-Completion-Report.pdf`](docs/Increment-2-Completion-Report.pdf)  

---

## 1. Project Overview & Scope Alignment
**DormFinder** is a centralized web application designed to connect university students of Cebu Institute of Technology - University (CIT-U) with local accredited boarding house landlords and dormitory operators in surrounding barangays (Sambag 1, Sambag 2, Punta Princesa, Basak San Nicolas, and Guadalupe).

This repository contains the complete, integrated implementation of **Project Increment 1 (User Accounts and Authentication)** and **Project Increment 2 (User Profile and Password Management)**, strictly aligned with the approved **Software Requirements Specification (SRS)**:
- **Feature 1:** User Authentication and Role-Based Access Control (FR-001 to FR-006)
- **Feature 1 Extension:** Profile Management, Self-Service Password Reset, and Authenticated Password Change
- **Role-Based Portals:** Separate, dedicated interfaces for **Students**, **Landlords**, and **Administrators**
- **Architecture:** Full three-tier integration (ReactJS Frontend + Spring Boot 3 Backend + MariaDB/MySQL Database)

---

## 2. Implemented Features Summary

### Increment 1 Core Features (Preserved & Fully Operational)
1. **User Account Creation (Registration):**
   - Dual-role registration workflow supporting **College Students** and **Boarding House Landlords**.
   - Input field validation, duplicate account prevention, and password hashing with **BCrypt (strength 12)**.
   - Atomic database persistence across relational tables (`users`, `student_profiles`, `landlord_profiles`).
2. **User Login and Logout:**
   - Authenticates credentials via Spring Security's `AuthenticationManager`.
   - Issues cryptographic **HMAC-SHA256 JWT tokens** valid for 24 hours.
   - Clean 401 Unauthorized handling, `/api/auth/me` session hydration, and token-clearing logout.
3. **Role-Based User Dashboards:**
   - Dedicated portals for Student (`/student/dashboard`), Landlord (`/landlord/dashboard`), and Admin (`/admin/dashboard`).
   - Protected client routing (`ProtectedRoute`, `RoleRoute`) and backend method-level security (`@PreAuthorize`).

### Increment 2 Core Features (User Profile and Password Management)
1. **User Profile Management:**
   - Authenticated users can view and edit their own profile information via `/profile` and their role dashboard tabs.
   - **Student Profile:** In-place editing of first name, last name, mobile phone number, academic program/course, year level (1 to 5), and emergency contact.
   - **Landlord Profile:** In-place editing of first name, last name, mobile phone number, business permit number, and office/management address.
   - **Profile Isolation:** SecurityContext-backed user resolution guarantees users can only update their own records, preventing unauthorized profile modifications.
2. **Reset Password (Forgot Password):**
   - Accessible from the login screen (`/forgot-password`).
   - Generates a cryptographically secure, single-use, 15-minute expiring token (`PasswordResetToken` table).
   - Real-time token verification endpoint (`GET /api/auth/verify-reset-token`).
   - Reset submission (`POST /api/auth/reset-password`) validates minimum 8-character length, enforces non-reuse of existing password, updates BCrypt hash, and marks token as used (`is_used = true`).
3. **Change Password:**
   - Authenticated users can change passwords from their profile or dashboard security tabs.
   - Strictly verifies current password matching against the stored BCrypt hash.
   - Enforces new password complexity and mismatch prevention.
   - Invalidates previous authentication credentials immediately upon update.

---

## 3. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | ReactJS + Vite | 18.2 / 5.1 | Responsive Single-Page Application (SPA) |
| **Routing & State**| React Router DOM + Context API | 6.x | Client-side routing, route guards, auth state |
| **Icons & UI** | Lucide React + Tailwind CSS | 0.344 | Modern clean dashboard styling and iconography |
| **Backend** | Spring Boot | 3.2.4 | RESTful web services and business logic |
| **Security** | Spring Security + JJWT | 6.x / 0.11.5 | BCrypt hashing, JWT issuance and token verification |
| **Persistence** | Spring Data JPA / Hibernate | 3.2.4 | Object-Relational Mapping (ORM) |
| **Database** | MariaDB / MySQL Server | 10.4 / 8.0 | Relational database (`localhost:3306`) |

---

## 4. Demo Accounts (Pre-Seeded in Database)

The backend includes a `DataInitializer` that automatically seeds test accounts on the first run:

| Role | Email | Password | Pre-Configured SRS Profile Details |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@dormfinder.com` | `Admin@123` | System Administrator, CIT-U Housing Office |
| **STUDENT** | `student@cit.edu` | `Student@123` | Juan Dela Cruz, ID: `23-0065-102`, BSIT Year 3 |
| **LANDLORD** | `landlord@dormfinder.com` | `Landlord@123` | Maria Santos, Permit: `BP-CEBU-2026-9041`, Sambag 1 |

---

## 5. Step-by-Step Setup & Execution Instructions

### Prerequisites
1. **Java Development Kit (JDK 17 or higher)** installed.
2. **Node.js (v18 or higher)** and **npm** installed.
3. **MariaDB or MySQL Server** running on `localhost:3306`.

### Step 1: Clone the Repository
```bash
git clone https://github.com/mhalnicole/IT342-DormFinder.git
cd IT342-DormFinder
```

### Step 2: Set Up the Database
Open your MySQL or MariaDB command line (or phpMyAdmin / MySQL Workbench) and run:
```sql
CREATE DATABASE IF NOT EXISTS dormfinder_db;
```
> **Note:** The backend is configured in `backend/src/main/resources/application.properties` with default user `root` and empty password `""`.

### Step 3: Run the Spring Boot Backend
Open a terminal in the `backend` folder:
```bash
cd backend
# Windows:
.\mvnw.cmd spring-boot:run

# Linux / macOS:
./mvnw spring-boot:run
```
The backend starts on **`http://localhost:8080`**. Schema tables and seed accounts are initialized automatically.

### Step 4: Run the React Frontend
Open a second terminal in the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
The frontend starts on **`http://localhost:5173`**.

Open your browser and navigate to **`http://localhost:5173`**.

---

## 6. REST API Endpoints Overview

### Public & Authentication Endpoints
- `POST /api/auth/register` - Register a new Student or Landlord account
- `POST /api/auth/login` - Authenticate credentials and receive a signed JWT
- `GET /api/auth/me` - Validate active session token and retrieve current user info
- `POST /api/auth/logout` - Terminate authenticated session
- `POST /api/auth/forgot-password` - Request a password reset token for a registered email
- `GET /api/auth/verify-reset-token` - Verify single-use reset token validity and expiry
- `POST /api/auth/reset-password` - Reset password with verified token and new credentials

### Authenticated User Profile & Security Endpoints
- `GET /api/users/profile` - Retrieve current authenticated user's profile and credentials
- `PUT /api/users/profile` - Update authenticated user's profile details and role attributes
- `PUT /api/users/change-password` - Change password verifying current password and new password

### Protected Role-Based Endpoints
- `GET /api/student/dashboard` - Retrieve student-specific metrics and profile (*Requires `ROLE_STUDENT`*)
- `GET /api/landlord/dashboard` - Retrieve landlord properties and inquiries (*Requires `ROLE_LANDLORD`*)
- `GET /api/admin/dashboard` - Retrieve system health and user counts (*Requires `ROLE_ADMIN`*)
- `GET /api/admin/users` - Retrieve complete registered user directory (*Requires `ROLE_ADMIN`*)
- `PATCH /api/admin/users/{id}/toggle-status` - Activate or deactivate an account (*Requires `ROLE_ADMIN`*)

---

## 7. Project Documentation
- **Software Requirements Specification (SRS):** Prepared using CIT-U IT342 SRS specification.
- **Project Increment 2 Completion Report:** Saved in [`docs/Increment-2-Completion-Report.pdf`](docs/Increment-2-Completion-Report.pdf) with full CRUD operation matrices, database models, file references, validation business rules, and high-resolution interface verification screenshots.

---

## 8. License & Academic Integrity
Developed by **Mhalia Nicole P. Paton-og** for **IT342: Systems Integration and Architecture 1**, College of Computer Studies, Cebu Institute of Technology - University. All rights reserved.
