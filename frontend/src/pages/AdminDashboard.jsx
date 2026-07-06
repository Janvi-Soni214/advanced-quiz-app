import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Temporary container state for a single question being created
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    points: 10
  });

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const addQuestion = () => {
    if (!currentQuestion.questionText || currentQuestion.options.some(opt => !opt)) {
      alert('Please fill out the question prompt and all 4 options before adding.');
      return;
    }
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      points: 10
    });
  };

  const handlePublishQuiz = async (e) => {
    e.preventDefault();
    if (questions.length === 0) {
      setError('You must append at least one question to publish a quiz.');
      return;
    }

    try {
      await API.post('/quizzes', { title, description, duration, questions });
      setSuccess('Quiz context established and successfully deployed onto system nodes!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to establish test context.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5 pb-5">
        <h2 className="fw-bold mb-4 text-dark">Instructor Management Portal</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="row g-4">
          {/* Metadata Section */}
          <div className="col-lg-5">
            <div className="card shadow-sm p-4 border-0 bg-light">
              <h4 className="fw-bold mb-3 text-dark">Quiz Configurations</h4>
              <div className="mb-3">
                <label className="form-label fw-semibold">Assessment Title</label>
                <input type="text" className="form-control" placeholder="e.g., MERN Stack Evaluation" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea className="form-control" rows="3" placeholder="Instructions or parameters..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Time Allocation (Minutes)</label>
                <input type="number" className="form-control" min="1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} required />
              </div>
              <button className="btn btn-primary w-100 fw-bold mt-3" onClick={handlePublishQuiz}>
                Publish Test Roster ({questions.length} Added)
              </button>
            </div>
          </div>

          {/* Question Builder Component Section */}
          <div className="col-lg-7">
            <div className="card shadow-sm p-4 border-0">
              <h4 className="fw-bold mb-3 text-dark">Question Builder Tool</h4>
              <div className="mb-3">
                <label className="form-label fw-semibold">Question Prompt Text</label>
                <input type="text" className="form-control" placeholder="Enter question description..." value={currentQuestion.questionText} onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })} />
              </div>

              <label className="form-label fw-semibold">Options Configuration</label>
              {currentQuestion.options.map((option, idx) => (
                <div className="input-group mb-2" key={idx}>
                  <span className="input-group-text bg-white">Option {idx + 1}</span>
                  <input type="text" className="form-control" placeholder={`Choice content text...`} value={option} onChange={(e) => handleOptionChange(idx, e.target.value)} />
                </div>
              ))}

              <div className="row mt-3">
                <div className="col-sm-6 mb-3">
                  <label className="form-label fw-semibold">Correct Selection Choice</label>
                  <select className="form-select" value={currentQuestion.correctOptionIndex} onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctOptionIndex: Number(e.target.value) })}>
                    <option value={0}>Option 1</option>
                    <option value={1}>Option 2</option>
                    <option value={2}>Option 3</option>
                    <option value={3}>Option 4</option>
                  </select>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="form-label fw-semibold">Score Points Value</label>
                  <input type="number" className="form-control" min="5" step="5" value={currentQuestion.points} onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: Number(e.target.value) })} />
                </div>
              </div>

              <button type="button" className="btn btn-outline-success w-100 fw-bold mt-2" onClick={addQuestion}>
                ➕ Append Question to Manifest
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;