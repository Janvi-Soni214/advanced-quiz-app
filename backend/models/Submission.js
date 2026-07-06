const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{ questionId: String, selectedOptionIndex: Number }],
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  
  // New Anti-Cheat Security Fields
  cheatAttempts: { type: Number, default: 0 },
  cheatingFlagged: { type: Boolean, default: false },
  
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);