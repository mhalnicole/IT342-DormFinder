# DormFinder: Student Boarding House and Dormitory Listing System
### IT342 - Systems Integration and Architecture 1 | Cebu Institute of Technology - University
**Project Increment 1: User Accounts and Authentication**  
**Author:** Mhalia Nicole P. Paton-og (`mhals`)  
**Academic Term:** First Semester, A.Y. 2026-2027  

---

## 1. Project Overview & Scope Alignment
**DormFinder** is a centralized web application designed to connect university students of Cebu Institute of Technology - University (CIT-U) with local accredited boarding house landlords and dormitory operators in surrounding barangays (Sambag 1, Sambag 2, Punta Princesa, Basak San Nicolas, and Guadalupe).

This repository contains the complete implementation of **Project Increment 1 (User Accounts and Authentication)**, fully aligned with the approved **Software Requirements Specification (SRS)**:
- **Feature 1:** User Authentication and Role-Based Access Control (FR-001 to FR-006)
- **Role-Based Portals:** Separate, dedicated interfaces for **Students**, **Landlords**, and **Administrators**
- **Architecture:** Full three-tier integration (ReactJS Frontend + Spring Boot 3 Backend + MariaDB/MySQL Database)

---

## 2. Implemented Features

### 1. User Account Creation (Registration)
- Dual-role registration workflow supporting **College Students** and **Boarding House Landlords**.
- **Field Validation:** Strict validation of required fields (first name, last name, valid email format, password minimum length >= 6 characters, phone number).
- **SRS Entity Data Collection:**
  - **Students (`STUDENT_PROFILES`):** Student ID Number (e.g., `23-0065-102`), Course/Academic Program (`BSIT`, `BSCS`, `BSCE`, etc.), Year Level, and Emergency Contact.
  - **Landlords (`LANDLORD_PROFILES`):** Business Permit / Clearance Number, Office / Physical Address.
- **Duplicate Prevention:** Rejects duplicate email registrations with an HTTP 409 Conflict status.
- **Password Hashing:** Passwords are salted and hashed using **BCrypt (strength 12)** prior to database insertion.
- **Transaction Safety:** Uses `@Transactional` to guarantee both user and role profile records are created atomically in MySQL.

### 2. User Login and Logout
- **Authentication:** Authenticates credentials via Spring Security's `AuthenticationManager` and `CustomUserDetailsService`.
- **JWT Session Management:** Issues a signed cryptographic JSON Web Token (HMAC-SHA256) valid for 24 hours.
- **Error Handling:** Returns clear, descriptive error messages for invalid credentials (HTTP 401) or deactivated accounts (HTTP 403).
- **Session Verification:** `GET /api/auth/me` validates the token on application refresh, restoring user identity.
- **Secure Logout:** Terminates the session, purges the stored JWT from `localStorage`, and immediately locks protected routes.
- **Backend Protection:** Spring Security filter chain (`JwtAuthenticationFilter`) guards all protected endpoints.

### 3. Role-Based User Dashboards
- **Student Dashboard (`/student/dashboard`):**
  - Displays student name, School ID, Course, Year Level, and enrollment badge.
  - Shows metrics: Active Viewing Requests (`0`), Saved Listings (`0`), CIT-U Proximity Target (`0.45 km`), and Account Standing.
  - Features quick accommodation search bar and inspection inquiry preview.
- **Landlord Dashboard (`/landlord/dashboard`):**
  - Displays landlord name, Business Permit No., Office Address, and Accreditation Status (`VERIFIED` / `PENDING`).
  - Shows metrics: Listed Properties, Room Capacity Units, and Pending Viewing Requests.
  - Includes property registration teaser and viewing appointment inbox.
- **Admin Dashboard (`/admin/dashboard`):**
  - Displays system-wide metrics: Total Users, Total Students, Total Landlords, and Database Status.
  - **Live User Governance Table:** Queries MySQL in real-time (`/api/admin/users`) displaying all registered accounts.
  - **Account Governance Action:** Functional button to activate or deactivate user accounts (`PATCH /api/admin/users/{id}/toggle-status`).
- **Access Control Enforcement:**
  - **Frontend:** Protected routes and `RoleRoute` guards prevent unauthorized page visits (e.g., a student visiting `/admin/dashboard` is blocked with HTTP 403 Forbidden).
  - **Backend:** `@PreAuthorize("hasRole('...')")` enforces RBAC on every controller method.

---

## 3. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | ReactJS + Vite | 18.2 / 5.1 | Responsive Single-Page Application (SPA) |
| **Routing & State**| React Router DOM + Context API | 6.x | Client-side routing, route guards, auth state |
| **Icons & UI** | Lucide React + Tailwind CSS | 0.344 | Modern clean dashboard styling & iconography |
| **Backend** | Spring Boot | 3.2.4 | RESTful web services & business logic |
| **Security** | Spring Security + JJWT | 6.x / 0.11.5 | BCrypt hashing, JWT issuance & verification |
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

> **Tip:** You can also register a brand-new Student or Landlord account through the **Create Account** page!

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
> **Note:** The backend is configured in `backend/src/main/resources/application.properties` with default user `root` and empty password `""`. Update the password if your local MySQL instance has one.

### Step 3: Run the Spring Boot Backend
Open a terminal in the `backend` folder:
```bash
cd backend
# Windows:
.\mvnw.cmd spring-boot:run

# Linux / macOS:
./mvnw spring-boot:run
```
The backend will start on **`http://localhost:8080`**. Tables will be automatically created and pre-seeded.

### Step 4: Run the React Frontend
Open a second terminal in the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on **`http://localhost:5173`**.

Open your browser and navigate to **`http://localhost:5173`**.

---

## 📡 6. REST API Endpoints Overview

### Public & Authentication Endpoints
- `POST /api/auth/register` - Register a new Student or Landlord account
- `POST /api/auth/login` - Authenticate credentials and receive a signed JWT
- `GET /api/auth/me` - Validate active session token and retrieve current user info
- `POST /api/auth/logout` - Terminate authenticated session

### Protected Role-Based Endpoints
- `GET /api/student/dashboard` - Retrieve student-specific metrics and profile (*Requires `ROLE_STUDENT`*)
- `GET /api/landlord/dashboard` - Retrieve landlord properties and inquiries (*Requires `ROLE_LANDLORD`*)
- `GET /api/admin/dashboard` - Retrieve system health and user counts (*Requires `ROLE_ADMIN`*)
- `GET /api/admin/users` - Retrieve complete registered user directory (*Requires `ROLE_ADMIN`*)
- `PATCH /api/admin/users/{id}/toggle-status` - Activate or deactivate an account (*Requires `ROLE_ADMIN`*)

---

## 7. License & Academic Integrity
Developed by **Mhalia Nicole P. Paton-og** for **IT342: Systems Integration and Architecture 1**, College of Computer Studies, Cebu Institute of Technology - University. All rights reserved.
