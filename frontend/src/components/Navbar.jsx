import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-success" to="/dashboard">
          ⚡ QuizEngine Pro
        </Link>
        
        <div className="d-flex align-items-center">
          {user && (
            <>
              <span className="navbar-text text-light me-3">
                Welcome, <strong>{user.name}</strong> 
                <span className="badge bg-secondary ms-2 text-capitalize">{user.role}</span>
              </span>
              
              {user.role === 'admin' && (
                <Link className="btn btn-outline-info btn-sm me-2" to="/admin">
                  Admin Panel
                </Link>
              )}
              
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;