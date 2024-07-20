
import fetch from 'node-fetch';
import { GoogleGenerativeAI } from "@google/generative-ai";

const generateQuestionsWithGemini = async (difficulty, topic, numberOfQuestions) => {
  const apiKey = 'INPUT-API-KEY';
  const genAI = new GoogleGenerativeAI(apiKey);

  const systemInstruction = `
  You are an intelligent assistant specializing in adaptive assessments and document processing.
  Please generate the questions in the following JSON format and provide the correct option:
  [
    {
      "text": "<question_text>",
      "options": ["<option1>", "<option2>", "<option3>", "<option4>"],
      "correctOption": <correct_option_index>,
      "difficulty": ${difficulty},
      "topic": "${topic}"
    }
  ]
  `;

  const prompt = `${systemInstruction} Generate ${numberOfQuestions} questions on the topic ${topic} with difficulty level ${difficulty} and provide the correct option`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = await response.text();

  console.log('Raw AI Response:', text);

  // Correctly handle code fences
  if (text.startsWith('```json') && text.endsWith('```')) {
    text = text.slice(7, -3).trim(); // Remove '```json' and '```' and trim whitespace
  }

  // Further handling for different code fences or accidental characters
  text = text.replace(/^[`]{3}json/, '').replace(/[`]{3}$/, '').trim();

  let questions;
  try {
    if (text.trim().length > 0 && (text.startsWith('{') || text.startsWith('['))) {
      questions = JSON.parse(text);
    } else {
      console.error('Unexpected response format:', text);
      throw new Error('Invalid AI response format');
    }
  } catch (error) {
    console.error('Error parsing generated questions:', error);
    throw new Error('Invalid AI response format');
  }

  questions.forEach((question, index) => {
    console.log(`Question ${index + 1}: ${question.text}`);
    console.log(`Correct Option Index: ${question.correctOption}`);
    console.log(`Options: ${question.options}`);
  });

  return questions;
};

export default generateQuestionsWithGemini;
