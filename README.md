# QuizVerse - Advanced MERN Stack Quiz Platform 🚀

A full-stack, secure, and scalable quiz web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Designed with role-based access control (RBAC), server-side evaluation, and anti-cheat mechanisms, this platform provides a robust assessment environment for both administrators and end-users.

## ✨ Features

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
* Context API / Redux (State Management)
* Tailwind CSS (Styling & Responsive Design)

**Backend:**
* Node.js
* Express.js (RESTful API architecture)
* JSON Web Tokens (JWT) for secure authentication
* bcryptjs (Password cryptography)

**Database:**
* MongoDB
* Mongoose (ODM & Schema Modeling)

## ⚙️ Installation & Setup

Follow these steps to run the project locally on your machine.

**1. Clone the repository**
```bash
git clone https://github.com/your-username/QuizVerse.git
cd QuizVerse
```

**2. Backend Setup**
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend server:
```bash
npm run dev
```

**3. Frontend Setup**
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
Start the Vite development server:
```bash
npm run dev
```

## 📂 Project Structure

```text
QuizVerse/
├── backend/
│   ├── controllers/      # Route logic (auth, quiz, user)
│   ├── models/           # Mongoose schemas (User, Quiz, Result)
│   ├── middleware/       # Auth and Role verification
│   ├── routes/           # Express API endpoints
│   └── server.js         # Entry point
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── context/      # Auth and Quiz state
    │   ├── pages/        # Dashboard, QuizPage, Login, Admin
    │   └── App.jsx       # Main routing file
```

## 🔌 API Endpoints 

Here is a quick snapshot of the primary API endpoints:

**Authentication**
* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Authenticate user & issue JWT

**Quizzes**
* `POST /api/quizzes` - (Admin only) Create a new quiz
* `GET /api/quizzes` - Fetch available quizzes (answers hidden from frontend)
* `GET /api/quizzes/:id` - Fetch specific quiz details
* `POST /api/quizzes/:id/submit` - Submit quiz for server-side evaluation

**Analytics & Leaderboard**
* `GET /api/leaderboard` - Fetch top performers using Mongo aggregation
* `GET /api/users/history` - Fetch current user's past attempts

## 👨‍💻 Author

**Janvi Soni**
* GitHub: [@Janvi-Soni214](https://github.com/Janvi-Soni214)
* LinkedIn: [Janvi Soni](https://www.linkedin.com/in/janvi-soni-298b75403/)

## 📄 License

This project is licensed under the MIT License. Feel free to use it for learning and portfolio purposes.
