# StaffSync - Modern Human Resource Management Solution 🚀

> A comprehensive, modern web application built on the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with **Bootstrap 5**, **JWT Authentication**, and **Role-Based Access Control (RBAC)** that streamlines and automates core HR processes across an organization.

---

## 🌟 Executive Summary

**StaffSync** provides distinct roles and access levels for **HR Personnel**, **Managers**, and **Employees**, ensuring organizational alignment, operational transparency, and continuous productivity:

* **HR Personnel (Admin)**: Manage complete employee lifecycle (onboarding, editing, deactivation), audit company-wide attendance logs, supervise leave requests, broadcast announcements, schedule training programs, and inspect workforce intelligence analytics.
* **Team Managers**: Monitor direct team presence, review and approve/reject leave requests with custom feedback notes, manage team upskilling, and assign team members to training cohorts.
* **Staff Employees**: Self-service portal featuring a live interactive clock-in/clock-out stopwatch widget, time-off application with automated balance deductions, enrollment in training programs, real-time announcements, and personal record management.

---

## 🛠️ Technology Stack & Skills

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React.js 19, Vite, Bootstrap 5, Bootstrap Icons, Lucide React, Axios, React Router 7 |
| **Backend** | Node.js, Express.js 5, JSON Web Token (JWT), bcryptjs, CORS, Dotenv |
| **Database** | MongoDB & Mongoose + High-Performance Zero-Config Fallback Storage Engine (`store.json`) |
| **Security** | Role-Based Access Control (RBAC) middleware, Password Hashing, Protected Routes |

---

## 🔐 1-Click Interactive Demo Accounts

StaffSync includes pre-seeded accounts and **1-Click Quick Demo Login** buttons on the Login page for immediate reviewer testing:

| Role | Email | Password | Scope & Responsibilities |
| :--- | :--- | :--- | :--- |
| 👑 **HR Personnel** | `hr@staffsync.com` | `admin123` | Full enterprise control: Employee directory CRUD, company attendance, leave approvals, broadcast notices, and reports. |
| 👔 **Team Manager** | `manager@staffsync.com` | `manager123` | Department lead: Review team leaves (Approve/Reject), monitor live team presence, assign staff to trainings. |
| 💻 **Staff Employee** | `employee@staffsync.com` | `employee123` | Self-service: Live stopwatch shift clock-in, leave application, training catalog, personal profile. |

---

## 📁 Project Architecture

```
staffsync/
├── package.json                   # Root workspace scripts
├── README.md                      # Comprehensive documentation
├── backend/                       # Express.js REST API Server
│   ├── .env                       # Environment configuration
│   ├── server.js                  # Server entry point & route registration
│   ├── package.json               # Backend dependencies
│   ├── test-api.js                # Automated end-to-end API test suite
│   ├── config/
│   │   └── db.js                  # Database connection logic
│   ├── data/
│   │   ├── dbAdapter.js           # Hybrid Mongoose & persistent JSON store adapter
│   │   ├── seedData.js            # Initial realistic accounts & records
│   │   └── store.json             # Persistent data storage file
│   ├── middleware/
│   │   └── auth.js                # JWT verification & RBAC role guards
│   ├── models/                    # Mongoose schemas & proxies
│   │   ├── User.js                # Staff & leadership credentials & profiles
│   │   ├── Attendance.js          # Clock-in / clock-out records & shift metrics
│   │   ├── Leave.js               # Time-off requests, balances & approval statuses
│   │   ├── Announcement.js        # Company notice board broadcasts
│   │   ├── Training.js            # Upskilling programs & cohort enrollments
│   │   └── Notification.js        # Real-time event notifications
│   ├── controllers/               # Business logic & operational workflows
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── attendanceController.js
│   │   ├── leaveController.js
│   │   ├── announcementController.js
│   │   ├── trainingController.js
│   │   ├── analyticsController.js
│   │   └── notificationController.js
│   └── routes/                    # RESTful endpoints
└── frontend/                      # Modern React + Vite Single Page Application
    ├── index.html                 # HTML shell with StaffSync branding
    ├── vite.config.js             # Vite proxy setup for backend on port 5000
    ├── package.json               # Frontend dependencies (Bootstrap, Lucide, Axios)
    └── src/
        ├── App.jsx                # Main route dispatcher & protected layout
        ├── index.css              # Custom styles, transitions, responsive sidebar
        ├── main.jsx               # React bootstrap mounting & providers
        ├── api/
        │   └── axiosClient.js     # Axios interceptor with automatic JWT injection
        ├── context/
        │   ├── AuthContext.jsx    # Session state, login, register, 1-click switcher
        │   └── NotificationContext.jsx # Real-time notification polling & state
        ├── components/
        │   ├── Navbar.jsx         # Header with quick persona switcher & notifications
        │   ├── Sidebar.jsx        # Role-tailored collapsible navigation
        │   ├── ProtectedRoute.jsx # Role-aware client route protection
        │   ├── ClockInOutWidget.jsx # Live ticking stopwatch timer & attendance widget
        │   ├── StatCard.jsx       # Metric cards with trend badges
        │   ├── LeaveApplicationModal.jsx
        │   ├── AddEmployeeModal.jsx
        │   ├── CreateAnnouncementModal.jsx
        │   ├── CreateTrainingModal.jsx
        │   └── AssignTrainingModal.jsx
        └── pages/
            ├── LandingPage.jsx    # Public showcase with feature breakdown
            ├── LoginPage.jsx      # Login form with 1-click demo role switchers
            ├── RegisterPage.jsx   # Staff onboarding registration
            ├── DashboardPage.jsx  # Dynamic view for HR, Manager, or Employee
            ├── EmployeesPage.jsx  # Staff roster with grid/table view & filters
            ├── AttendancePage.jsx # Personal shifts & company-wide presence log
            ├── LeavesPage.jsx     # Leave balances, requests, and manager review
            ├── AnnouncementsPage.jsx # Notice board with urgent/priority tags
            ├── TrainingsPage.jsx  # Workshop catalog & self-enrollment
            ├── AnalyticsPage.jsx  # Workforce KPIs, department distribution charts
            └── ProfilePage.jsx    # User profile, skills, emergency contacts
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
* **Node.js** (v16 or above recommended, tested on v24)
* **npm** (v8 or above)
* Optional: Local MongoDB instance or MongoDB Atlas URI (If MongoDB is not running, StaffSync's built-in persistent storage engine activates automatically with zero errors).

### 2. Run the Backend API Server
```bash
cd backend
npm install
node server.js
```
* Backend starts at `http://localhost:5000`.
* Preloaded seed accounts and initial data will be loaded automatically.
* You can run automated API tests at any time with:
  ```bash
  node test-api.js
  ```

### 3. Run the Frontend Client
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
* Frontend starts at `http://localhost:3000` (or `http://localhost:5173`).
* Open in your browser, click any of the **1-Click Demo Login** buttons, and experience the platform!

---

## 📡 API Reference Overview

### Authentication (`/api/auth`)
* `POST /api/auth/login` - Authenticate with email/password; returns JWT and user profile.
* `POST /api/auth/register` - Create a new user account.
* `GET /api/auth/me` - Retrieve authenticated user info.
* `PUT /api/auth/profile` - Update personal details (phone, address, emergency contact, skills).

### Employees (`/api/employees`)
* `GET /api/employees` - Search and list employees (filters: `department`, `role`, `search`).
* `GET /api/employees/team` - List direct reports for the authenticated manager.
* `POST /api/employees` - Onboard new staff member (*HR only*).
* `PUT /api/employees/:id` - Update employee details (*HR or Manager*).
* `DELETE /api/employees/:id` - Remove employee (*HR only*).

### Attendance (`/api/attendance`)
* `GET /api/attendance/today` - Active user's shift status and clock-in timestamp.
* `POST /api/attendance/clock-in` - Record check-in timestamp and auto-detect late status.
* `POST /api/attendance/clock-out` - End shift and calculate total hours worked.
* `GET /api/attendance/my` - Historical attendance log for the current employee.
* `GET /api/attendance/team` - Team daily check-in records (*Manager/HR*).
* `GET /api/attendance/all` - Company-wide daily attendance audits (*HR only*).

### Leaves (`/api/leaves`)
* `GET /api/leaves/balances` - Annual, Sick, and Casual leave allocations and remaining balances.
* `GET /api/leaves/my` - Personal leave request history.
* `POST /api/leaves` - Submit new time-off application.
* `GET /api/leaves/team` - Pending leave requests for team lead review (*Manager/HR*).
* `GET /api/leaves/all` - Organization-wide leave requests (*HR only*).
* `PUT /api/leaves/:id/status` - Approve or reject leave with feedback comments (*Manager/HR*).

### Announcements (`/api/announcements`)
* `GET /api/announcements` - Company-wide and department-specific notices.
* `POST /api/announcements` - Broadcast announcement with Urgent/High/Normal tags (*HR only*).
* `PUT /api/announcements/:id` - Edit announcement (*HR only*).
* `DELETE /api/announcements/:id` - Delete announcement (*HR only*).

### Training & Skills (`/api/trainings`)
* `GET /api/trainings` - Catalog of technical and leadership programs.
* `POST /api/trainings` - Create new training cohort (*HR or Manager*).
* `POST /api/trainings/:id/enroll` - Self-enrollment for staff.
* `POST /api/trainings/:id/assign` - Manager assignment of team member to training.
* `DELETE /api/trainings/:id` - Delete program (*HR or Manager*).

### Analytics & Reports (`/api/analytics`)
* `GET /api/analytics/dashboard` - Headcounts, daily attendance rate, leave distribution, and operational event feed (*HR/Manager*).

---

## 🔒 Security & Data Integrity
1. **JWT Authentication**: Passwords never transmitted in cleartext; tokens signed with HMAC SHA-256 and stored securely in client memory/headers.
2. **Password Encryption**: All credentials hashed using `bcryptjs` with 10 salt rounds.
3. **Role-Based Access Control**: Server routes guarded by `requireRole('hr')`, `requireRole('manager', 'hr')`, preventing unauthorized privilege escalation.
4. **Resilient Data Architecture**: Operates on live MongoDB or activates instant file-backed persistence without external database hurdles.

---

## 👨‍💻 Author & Solution Details
* **Project Name**: StaffSync - Modern Human Resource Management Solution
* **Stack**: MERN (MongoDB, Express, React, Node.js) + Bootstrap 5
* **Repository Location**: `C:\Users\samar\.gemini\antigravity\scratch\staffsync`
