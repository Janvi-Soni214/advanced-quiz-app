import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext'; 

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await API.get('/quizzes');
        
        // 🛡️ DEFENSIVE CHECK: Verify data is an array before setting state
        if (Array.isArray(response.data)) {
          setQuizzes(response.data);
        } else {
          console.warn("Backend Response is:", JSON.stringify(response.data, null, 2));
          setQuizzes([]); // Fallback to an empty list to prevent crashes
        }
      } catch (err) {
        setError('Failed to load active assessments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark">Available Assessments</h2>
            <p className="text-muted">Select a challenge below to evaluate your technical skills.</p>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-success" role="status"></div>
            <p className="mt-2 text-muted">Compiling online test rosters...</p>
          </div>
        ) : !Array.isArray(quizzes) || quizzes.length === 0 ? (
          <div className="text-center my-5 p-5 bg-light rounded shadow-sm">
            <h4>No Quizzes Active</h4>
            <p className="text-muted mb-0">Check back later when an instructor hosts an assessment.</p>
          </div>
        ) : (
          <div className="row g-4">
            {quizzes.map((quiz) => (
              <div className="col-md-6 col-lg-4" key={quiz._id}>
                <div className="card h-100 shadow-sm border-0 transition-hover">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-dark mb-2">{quiz.title}</h5>
                    <p className="card-text text-muted flex-grow-1">
                      {quiz.description || 'No description provided for this assessment.'}
                    </p>
                    <hr className="text-muted opacity-25" />
                    <div className="d-flex justify-content-between text-small mb-3">
                      <span className="text-secondary">
                        ⏱️ <strong>{quiz.duration}</strong> Mins
                      </span>
                      <span className="text-secondary">
                        📋 <strong>{quiz.questions?.length || 0}</strong> Questions
                      </span>
                    </div>
                    
                    <button 
                      className="btn btn-success w-100 fw-bold mt-auto mb-2"
                      onClick={() => navigate(`/quiz/${quiz._id}`)}
                    >
                      Launch Assessment
                    </button>

                    {/* Security Check: Only Admins see this button */}
                    {user?.role === 'admin' && (
                      <button 
                        className="btn btn-outline-dark w-100 fw-bold"
                        onClick={() => navigate(`/quiz/${quiz._id}/leaderboard`)}
                      >
                        View Standings & Answers 🏆
                      </button>
                    )}
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;