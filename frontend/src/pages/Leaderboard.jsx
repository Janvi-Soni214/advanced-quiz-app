import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import Navbar from '../components/Navbar';

const Leaderboard = () => {
  const { id: quizId } = useParams();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await API.get(`/quizzes/${quizId}/leaderboard`);
        setRankings(response.data);
      } catch (err) {
        console.error('Error fetching leaderboard array parameters.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboardData();
  }, [quizId]);

  return (
    <>
      <Navbar />
      <div className="container mt-5" style={{ maxWidth: '800px' }}>
        <div className="card shadow border-0 p-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">🏆 Performance Leaderboard</h2>
            <p className="text-muted">Real-time rank computations based on score metrics and submission speed.</p>
          </div>

          {loading ? (
            <div className="text-center my-4">
              <div className="spinner-border text-success"></div>
            </div>
          ) : rankings.length === 0 ? (
            <div className="alert alert-info text-center">No submissions documented for this test roster yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th scope="col" className="text-center">Rank</th>
                    <th scope="col">Candidate Name</th>
                    <th scope="col" className="text-center">Score Secured</th>
                    <th scope="col" className="text-center">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((row, index) => {
                    const accuracy = ((row.score / row.maxScore) * 100).toFixed(0);
                    let medalColor = "";
                    if (index === 0) medalColor = "👑 bg-warning text-dark fw-bold";
                    else if (index === 1) medalColor = "bg-light text-dark border fw-bold";
                    else if (index === 2) medalColor = "bg-secondary text-white fw-bold";

                    return (
                      <tr key={row._id}>
                        <td className="text-center">
                          <span className={`badge rounded-circle p-2 fs-6 ${medalColor || 'bg-dark text-white'}`} style={{ width: '35px', height: '35px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            {index + 1}
                          </span>
                        </td>
                        <td>
                          {/* STEP 4 INTEGRATED: Dynamic Cheating Flag Layout Block */}
                          <div className="fw-semibold d-flex align-items-center">
                            {row.user?.name}
                            {row.cheatingFlagged && (
                              <span className="badge bg-danger ms-2 px-2" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                                ⚠️ FLAG-CHEATING
                              </span>
                            )}
                          </div>
                          <small className="text-muted text-xs">{row.user?.email}</small>
                        </td>
                        <td className="text-center fw-bold text-success">
                          {row.score} <span className="text-muted fw-normal">/ {row.maxScore}</span>
                        </td>
                        <td className="text-center">
                          <div className="progress" style={{ height: '6px' }}>
                            <div className="progress-bar bg-info" style={{ width: `${accuracy}%` }}></div>
                          </div>
                          <small className="fw-bold text-info">{accuracy}%</small>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-center mt-3">
            <Link to="/dashboard" className="btn btn-outline-dark px-4 fw-bold">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;