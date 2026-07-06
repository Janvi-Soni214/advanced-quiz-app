import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // Defaults to student
    adminSecret: '' // Hidden field
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Pass the formData to your AuthContext register function
      await register(formData);
      toast.success('Registration successful! Welcome aboard.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please verify your details.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg border-0 p-4" style={{ width: '100%', maxWidth: '450px' }}>
        <h3 className="text-center fw-bold mb-4 text-success">Create an Account</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              name="name" 
              placeholder="Arpan Bhavsar"
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              name="email" 
              placeholder="name@example.com"
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Password</label>
            <input 
              type="password" 
              className="form-control" 
              name="password" 
              placeholder="••••••••"
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Account Type</label>
            <select 
              className="form-select" 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="user">Student / Candidate</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          {/* 🛡️ THE SECRET ADMIN FIELD: Only shows if "Admin" is selected */}
          {formData.role === 'admin' && (
            <div className="mb-4 p-3 border border-danger rounded bg-white">
              <label className="form-label fw-bold text-danger">Enter Admin Secret Key</label>
              <input 
                type="password" 
                className="form-control border-danger" 
                name="adminSecret" 
                placeholder="••••••••••••••"
                value={formData.adminSecret} 
                onChange={handleChange} 
                required={formData.role === 'admin'}
              />
              <small className="text-muted d-block mt-2">
                You must have system authorization to provision an admin account.
              </small>
            </div>
          )}

          <button type="submit" className="btn btn-success w-100 fw-bold mb-3 py-2">
            Register Account
          </button>
        </form>

        <div className="text-center">
          <span className="text-muted">Already have an account? </span>
          <Link to="/login" className="text-decoration-none fw-bold text-success">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;