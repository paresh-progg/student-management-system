# Student Management System

## Overview

The Student Management System (SMS) is a full-stack web application developed to manage student records efficiently. It provides functionalities for student registration, record management, attendance tracking, marks management, and report generation through a role-based access control system.

The project is built using Node.js, Express.js, MySQL, HTML, CSS, and JavaScript.

---

## Features

### Admin Features

* Add Student
* View Student Records
* Update Student Information
* Delete Student Records
* Search Students
* Dashboard with Statistics
* Attendance Management
* Marks Management
* Report Generation
* Role-Based Access Control (RBAC)

### Student Features

* Student Login
* View Profile
* View Attendance
* View Marks
* Download/View Report Card

---

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MySQL

### Tools

* Visual Studio Code
* MySQL Workbench
* Git & GitHub

---

## Project Structure

```text
student-management-system/
│
├── public/
│   ├── index.html
│   ├── dashboard.html
│   ├── style.css
│   └── script.js
│
├── routes/
│   └── students.js
│
├── database/
│   └── db.js
│
├── server.js
├── package.json
└── sms.sql
```

---

## Database Schema

### Students Table

| Column   | Type         |
| -------- | ------------ |
| id       | INT          |
| roll_no  | VARCHAR(20)  |
| name     | VARCHAR(100) |
| email    | VARCHAR(100) |
| course   | VARCHAR(50)  |
| semester | INT          |

### Admin Table

| Column   | Type         |
| -------- | ------------ |
| id       | INT          |
| username | VARCHAR(50)  |
| password | VARCHAR(255) |

### Attendance Table

| Column          | Type                     |
| --------------- | ------------------------ |
| id              | INT                      |
| student_id      | INT                      |
| attendance_date | DATE                     |
| status          | ENUM('Present','Absent') |

### Marks Table

| Column     | Type         |
| ---------- | ------------ |
| id         | INT          |
| student_id | INT          |
| subject    | VARCHAR(100) |
| marks      | INT          |

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd student-management-system
```

### Install Dependencies

```bash
npm install
```

### Required Packages

```bash
npm install express mysql2 cors body-parser
```

### Configure Database

1. Open MySQL Workbench.
2. Create a database named `sms`.
3. Execute the SQL scripts in `sms.sql`.

### Start Server

```bash
node server.js
```

---

## API Endpoints

### Students

| Method | Endpoint          | Description      |
| ------ | ----------------- | ---------------- |
| GET    | /api/students     | Get All Students |
| POST   | /api/students     | Add Student      |
| PUT    | /api/students/:id | Update Student   |
| DELETE | /api/students/:id | Delete Student   |

---

---

## Author

Paresh Sahoo

B.Tech CSE (Cyber Security)

Student Management System Project
