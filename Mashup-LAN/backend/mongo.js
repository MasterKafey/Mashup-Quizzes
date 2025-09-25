const mongoose = require('mongoose');

// ====== MongoDB Connection ======
mongoose.connect('mongodb://localhost:27017/Mashup', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, '❌ MongoDB connection error:'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB (Mashup DB)');
});

// ====== Define Quiz Schema ======
const quizSchema = new mongoose.Schema(
  {
    formName: { type: String, required: true },
    questions: [
      {
        type: {
          type: String,
          enum: ['MusiqueQuestion', 'TextQuestion'], // enforce only these types
          required: true
        },
        file: { type: String }, // only for MusiqueQuestion
        textQuestion: { type: String } // only for TextQuestion
      }
    ]
  },
  { timestamps: true }
);

const Quiz = mongoose.model('Quiz', quizSchema);

// ====== Exports ======
module.exports = {
  db,
  Quiz
};
