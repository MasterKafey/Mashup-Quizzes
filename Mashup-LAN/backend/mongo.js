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

// ====== Define Quiz Schema ======
const quizSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    questions: [{question:{ type: String , required: true }}],
    selectedFiles: [{ type: String , required: true }],
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

// ====== Exports ======
module.exports = {
  db,
  Quiz,
};
