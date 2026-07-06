import { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const QuizWindow = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [cheatAttempts, setCheatAttempts] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 1. Fetch Quiz Data
  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await API.get(`/quizzes/${quizId}`);
        setQuiz(response.data);
        setTimeLeft(response.data.duration * 60);
      } catch (err) {
        toast.error('Error compiling engine parameters.');
        navigate('/dashboard');
      }
    };
    fetchQuizDetails();
  }, [quizId, navigate]);

  // 2. Submit Quiz Logic
  const handleSubmitQuiz = useCallback(async (currentAttempts = cheatAttempts) => {
    if (isSubmitted || !quiz) return;
    setIsSubmitted(true);

    const formattedAnswers = Object.keys(selectedAnswers).map((qId) => ({
      questionId: qId,
      selectedOptionIndex: selectedAnswers[qId],
    }));

    try {
      const response = await API.post(`/quizzes/${quizId}/submit`, { 
        answers: formattedAnswers,
        cheatAttempts: currentAttempts 
      });
      
      if (response.data.cheatingFlagged) {
        toast.error(`❌ Exam Terminated due to security violations!\nYour submission was flagged for review.`, { duration: 5000 });
      } else {
        toast.success(`🎯 Assessment Finalized!\nScore: ${response.data.score} / ${response.data.maxScore}`);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Error pushing submission state to server.');
    }
  }, [quiz, selectedAnswers, quizId, navigate, isSubmitted, cheatAttempts]);

  // 3. Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0 && quiz && !isSubmitted) {
      handleSubmitQuiz();
      return;
    }
    if (isSubmitted) return;

    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quiz, handleSubmitQuiz, isSubmitted]);

  // 4. SECURITY HOOKS: Tab Switching, Context Menu, Shortcuts
  useEffect(() => {
    if (isSubmitted) return;

    // A. Track Tab Switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setCheatAttempts((prev) => {
          const updated = prev + 1;
          toast.error(`⚠️ Integrity Violation! Do not switch tabs. [Warning ${updated}/3]`, {
            style: { border: '1px solid #ff4b4b', padding: '16px', color: '#ff4b4b' },
            iconTheme: { primary: '#ff4b4b', secondary: '#FFFAEE' },
          });
          if (updated >= 3) {
            handleSubmitQuiz(updated);
          }
          return updated;
        });
      }
    };

    // B. Block Right-Click
    const handleContextMenu = (e) => {
      e.preventDefault();
      toast.error('⚠️ Right-click is completely disabled during this examination.');
    };

    // C. Block Copy/Paste/Print
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && e.key === 'c') || 
        (e.ctrlKey && e.key === 'v') || 
        (e.ctrlKey && e.key === 'x') ||
        (e.ctrlKey && e.key === 'p')
      ) {
        e.preventDefault();
        toast.error('⚠️ Security Policy: Clipboard and printing operations are locked.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSubmitQuiz, isSubmitted]);

  if (!quiz) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="card shadow border-0 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold text-dark">{quiz.title}</h3>
              <span className={`badge ${cheatAttempts > 0 ? 'bg-danger' : 'bg-secondary'} p-2`}>
                Security Infractions: {cheatAttempts} / 3
              </span>
            </div>
            <div className={`badge ${timeLeft < 60 ? 'bg-danger' : 'bg-dark'} fs-5 p-2`}>
              ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="progress mb-4" style={{ height: '6px' }}>
            <div className="progress-bar bg-success" style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}></div>
          </div>

          <div className="p-3 bg-light rounded mb-4">
            <h5 className="fw-bold mb-0">Q{currentQuestionIndex + 1}: {currentQuestion.questionText}</h5>
          </div>

          <div className="list-group mb-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                type="button"
                className={`list-group-item list-group-item-action p-3 mb-2 rounded border ${
                  selectedAnswers[currentQuestion._id] === idx ? 'bg-success text-white border-success' : ''
                }`}
                onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestion._id]: idx })}
              >
                <strong>{String.fromCharCode(65 + idx)}.</strong> {option}
              </button>
            ))}
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-secondary px-4 fw-bold" disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}>Previous</button>
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <button className="btn btn-primary px-4 fw-bold" onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}>Next Question</button>
            ) : (
              <button className="btn btn-danger px-4 fw-bold" onClick={() => handleSubmitQuiz()}>Finalize & Submit</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizWindow;