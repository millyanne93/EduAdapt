const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/testresults', require('./routes/testResultRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/questionpapers', require('./routes/questionPaperRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// Export the app instance for testing
module.exports = app;

// Start the server (if running directly)
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
