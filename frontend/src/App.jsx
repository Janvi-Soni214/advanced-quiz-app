import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import QuizWindow from './pages/QuizWindow';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Authentication Enclaves */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Core Student Portal - Restricted to authenticated Users and Admins */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/quiz/:id" 
         element={
         <ProtectedRoute allowedRoles={['user', 'admin']}>
          <QuizWindow />
         </ProtectedRoute>
  } 
/>
        <Route 
           path="/quiz/:id/leaderboard" 
           element = {
           <ProtectedRoute allowedRoles={['user', 'admin']}>
             <Leaderboard />
           </ProtectedRoute>
  } 
/>

        {/* Instructor Portal - Exclusively locked down to Admins */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Automatic Route Redirection Guardrail */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;