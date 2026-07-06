const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/auth');

// Hooking up the real controller functions
router.get('/', authMiddleware(), quizController.getAllQuizzes);
router.get('/:id', authMiddleware(), quizController.getQuizById);
router.post('/:id/submit', authMiddleware(), quizController.submitQuiz);
// Change this line:
router.get('/:id/leaderboard', authMiddleware('admin'), quizController.getLeaderboard);

// Admin publishing route
router.post('/', authMiddleware('admin'), quizController.createQuiz);

module.exports = router;