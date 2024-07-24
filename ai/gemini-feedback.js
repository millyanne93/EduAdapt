import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

const generateFeedbackWithGemini = async (testResults) => {

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);

  const systemInstruction = `
  You are an intelligent assistant specializing in educational assessments.
  Please provide detailed feedback for the test taker based on the following test results.
  The feedback should be constructive and offer insights on their strengths and areas for improvement.
  Here is the format of the test result data you will be working with:
  {
    "userId": "string",
    "testId": {
      "title": "string",
      "questions": [
        "string"
      ]
    },
    "responses": [
      {
        "questionId": "string",
        "selectedOption": number,
        "timeSpent": number
      }
    ],
    "score": number,
    "totalTimeSpent": number,
    "completedAt": "string"
  }
  `;

  const prompt = `${systemInstruction} Here are the test results: ${JSON.stringify(testResults)} Provide feedback for the test taker.`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const feedback = await response.text();

  console.log('Feedback:', feedback);

  return feedback;
};

export default generateFeedbackWithGemini;
