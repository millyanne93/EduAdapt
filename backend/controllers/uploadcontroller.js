const path = require('path');
const fs = require('fs');
const { extractTextFromPdf } = require('../utils/ocrUtils');
const { extractTextFromWord } = require('../utils/textExtraction');
const Question = require('../models/question');
const QuestionPaper = require('../models/questionPaper');

async function getGeminiModel() {
  const { default: processQuestionsWithGemini } = await import('../../ai/gemini_model.js');
  return processQuestionsWithGemini;
}

const processUploadedFile = async (req, res) => {
  const filePath = req.file.path;
  const fileExtension = path.extname(filePath);
  const topic = req.body.topic;

  if (!topic) {
    return res.status(400).json({ msg: 'Topic is required' });
  }

  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  if (!req.user || !req.user.id) {
    return res.status(400).json({ msg: 'User information is missing' });
  }

  if (fileExtension !== '.pdf' && fileExtension !== '.docx' && fileExtension !== '.doc') {
    return res.status(400).json({ msg: 'Unsupported file type' });
  }

  try {
    let extractedText;
    if (fileExtension === '.pdf') {
      extractedText = await extractTextFromPdf(filePath);
    } else if (fileExtension === '.docx' || fileExtension === '.doc') {
      extractedText = await extractTextFromWord(filePath);
    }

    const questions = parseTextToQuestions(extractedText, topic);

    // Get the Gemini AI model
    const processQuestionsWithGemini = await getGeminiModel();

    // Classify questions using Gemini AI and get additional data
    const processedQuestions = await processQuestionsWithGemini(questions);

    // Create a new QuestionPaper document
    const questionPaper = new QuestionPaper({
      filename: req.file.filename,
      uploadedBy: req.user.id,
      extractedQuestions: processedQuestions.map(q => q._id),  // Extracted question IDs
      topic: topic  // Add topic to the question paper
    });

    await questionPaper.save();  // Save question paper metadata to the database
    await Question.insertMany(processedQuestions);  // Save questions to the database

    res.status(200).json({ msg: 'Questions uploaded and extracted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error processing file' });
  } finally {
    fs.unlinkSync(filePath);
  }
};

// Implement the parsing logic for questions
const parseTextToQuestions = (text, topic) => {
  const questions = [];
  const lines = text.split('\n');
  let currentQuestion = { text: '', options: [], correctOption: 0, difficulty: 1, topic: topic };

  lines.forEach((line) => {
    if (line.trim().startsWith('Q:')) {
      if (currentQuestion.text && currentQuestion.options.length > 0) {
        questions.push(currentQuestion);
        currentQuestion = { text: '', options: [], correctOption: 0, difficulty: 1, topic: topic };
      }
      currentQuestion.text = line.replace('Q:', '').trim();
    } else if (line.trim().startsWith('Option:')) {
      currentQuestion.options.push(line.replace('Option:', '').trim());
    } else if (line.trim().startsWith('Answer:')) {
      currentQuestion.correctOption = parseInt(line.replace('Answer:', '').trim(), 10);
    } else if (line.trim().startsWith('Difficulty:')) {
      currentQuestion.difficulty = parseInt(line.replace('Difficulty:', '').trim(), 10);
    }
  });

  if (currentQuestion.text && currentQuestion.options.length > 0) {
    questions.push(currentQuestion);
  }

  return questions;
};

module.exports = { processUploadedFile };
