const mongoose = require('mongoose');

// ====== MongoDB Connection ======
mongoose.connect('mongodb://localhost:27017/Mashup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, '❌ MongoDB connection error:'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB (Mashup DB)');
});

// ====== Define Question Schema ======
const questionSchema = new mongoose.Schema(
  {
    question: { type: String, default: "" },
    music: { type: String, default: "" },
  },
  { _id: false }
);

// Custom validation: one must be filled, not both, not none
questionSchema.pre("validate", function (next) {
  const hasQuestion = this.question && this.question.trim().length > 0;
  const hasMusic = this.music && this.music.trim().length > 0;

  if ((hasQuestion && hasMusic) || (!hasQuestion && !hasMusic)) {
    return next(
      new Error(
        "❌ Each Question must have either a question OR a music (but not both, and not none)."
      )
    );
  }
  next();
});

// ====== Define Quiz Schema ======
const quizSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    questions: { type: [questionSchema], required: true },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

// ====== Exports ======
module.exports = {
  db,
  Quiz,
};
