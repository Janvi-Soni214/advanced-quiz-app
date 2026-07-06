const Quiz = require('../models/Quiz');
const Submission = require('../models/Submission');
const User = require('../models/User');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

exports.createQuiz = async (req, res, next) => {
  try {
    const { title, description, duration, questions } = req.body;
    const newQuiz = new Quiz({ title, description, duration, questions, creator: req.user.id });
    await newQuiz.save();
    res.status(201).json({ message: 'Quiz created successfully!', quiz: newQuiz });
  } catch (error) { next(error); }
};

exports.getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ isActive: true }).select('-questions.correctOptionIndex');
    res.json(quizzes);
  } catch (error) { next(error); }
};

exports.getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (req.user.role !== 'admin') {
      quiz.questions.forEach(q => q.correctOptionIndex = undefined);
    }
    res.json(quiz);
  } catch (error) { next(error); }
};

exports.submitQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const { answers, cheatAttempts } = req.body;
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    let maxScore = 0;

    quiz.questions.forEach((question) => {
      maxScore += question.points;
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      if (userAnswer && userAnswer.selectedOptionIndex === question.correctOptionIndex) {
        score += question.points;
      }
    });

    const cheatingFlagged = cheatAttempts >= 3;
    const submission = await Submission.create({
      user: userId, quiz: quizId, answers, score, maxScore, cheatAttempts: cheatAttempts || 0, cheatingFlagged
    });

// --- AUTOMATED EMAIL SYSTEM ---
    try {
      // 1. Fetch the student from the database to get their real email
      const student = await User.findById(userId); 

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: student.email, // 👈 2. Use the real email from the database!
        subject: `Assessment Results: ${quiz.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2c3e50;">Assessment Finalized!</h2>
            <p>Hi ${student.name},</p> <p>Your submission for <strong>${quiz.title}</strong> has been successfully recorded.</p>
            <h3 style="color: ${cheatingFlagged ? '#e74c3c' : '#27ae60'};">
              Final Score: ${score} / ${maxScore}
            </h3>
            ${cheatingFlagged ? '<p style="color: red;"><strong>⚠️ Note:</strong> Your assessment was flagged for security violations (tab switching/copy-pasting).</p>' : ''}
            <p>Thank you,</p>
            <p><strong>Examination Administration</strong></p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`✉️ Success! Result email sent to ${student.email}`); // Let's log it so we know it worked!
    } catch (emailError) {
      console.error("Email failed to send:", emailError);
    }
    // ------------------------------

    res.status(201).json({ message: 'Quiz submitted', score, maxScore, cheatingFlagged });
  } catch (error) { next(error); }
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const leaderboard = await Submission.aggregate([
      { $match: { quiz: new mongoose.Types.ObjectId(quizId) } },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userDetails' } },
      { $unwind: '$userDetails' },
      { $project: { _id: 1, score: 1, maxScore: 1, completedAt: 1, cheatingFlagged: 1, answers: 1, 'user.name': '$userDetails.name', 'user.email': '$userDetails.email' } },
      { $sort: { score: -1, completedAt: 1 } }
    ]);
    res.json(leaderboard);
  } catch (error) { next(error); }
};