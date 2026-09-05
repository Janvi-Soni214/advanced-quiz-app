# QuizVerse - Advanced MERN Stack Quiz Platform 🚀

A full-stack, secure, and scalable quiz web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Designed with role-based access control (RBAC), server-side evaluation, and anti-cheat mechanisms, this platform provides a robust assessment environment for both administrators and end-users.

## ✨ Key Features

* **Role-Based Access Control (RBAC):** Distinct dashboards and routing for Admins (quiz creators) and Users (quiz takers).
* **Secure Authentication:** JWT-based authentication using HTTP-only cookies and `bcryptjs` for secure password hashing.
* **Server-Side Evaluation:** Quiz logic and score calculations are processed on the backend API to prevent client-side tampering.
* **Anti-Cheat Mechanisms:** Enforced countdown timers and randomized question shuffling per session.
* **Dynamic Leaderboard:** Real-time global ranking system powered by optimized MongoDB Aggregation Pipelines.
* **Multi-Format Questions:** Support for standard Multiple Choice Questions (MCQs) and Multi-Select answers.
* **Performance Analytics:** Visual tracking of user performance history and category-wise scoring.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* React Router DOM (Navigation)
* Context API (State Management)
* Tailwind CSS / Bootstrap (Styling)

**Backend:**
* Node.js
* Express.js (RESTful API architecture)
* JSON Web Tokens (JWT) for Auth

**Database:**
* MongoDB
* Mongoose (ODM & Schema Modeling)

## ⚙️ Installation & Setup

Follow these steps to run the project locally on your machine.

**1. Clone the repository**
```bash
git clone [https://github.com/your-username/QuizVerse.git](https://github.com/your-username/QuizVerse.git)
cd QuizVerse
```
**2. Backend Setup**
```bash
cd backend
npm install
```
