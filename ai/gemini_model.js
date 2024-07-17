import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

const processQuestionsWithGemini = async (questions) => {
  genai.configure({ apiKey: process.env.GEMINI_API_KEY });

  const systemInstruction = `
  You are an intelligent assistant specializing in adaptive assessments and document processing. Your tasks include:

    1. Extracting questions from text documents such as PDFs and Word files.
    2. Classifying extracted questions into categories such as multiple choice, short answer, true/false, etc.
    3. Generating answer keys for the provided questions.
    4. Providing metadata for questions, including a difficulty level on a scale from 1 to 5 (1 being the easiest and 5 being the hardest) and the main topic.
    5. Recommending similar questions to the provided ones.
    6. Providing a list of questions based on different topics and difficulty levels.

    These functionalities are aimed at helping teachers upload and manage question papers, automatically extract and classify questions, and generate comprehensive assessment data.

    Examples of tasks:
    - Extracting questions from a block of text.
    - Classifying questions based on type.
    - Generating answers for questions.
    - Providing metadata like difficulty level (1 to 5) and topic for questions.
    - Recommending similar questions.
    - Providing a list of questions based on topic and difficulty level.
    
  Questions should vary in difficulty and cover different topics, and they must adhere to the following JSON format:

  [
    {
      "text": "What is 2 + 2?",
      "options": [
        "1",
        "2",
        "3",
        "4"
      ],
      "correctOption": 3,
      "difficulty": 1,
      "topic": "Math"
    },
    {
      "text": "What is the capital of France?",
      "options": [
        "Paris",
        "London",
        "Berlin",
        "Madrid"
      ],
      "correctOption": 1,
      "difficulty": 1,
      "topic": "Geography"
    }
  ]
  `;

  const model = new genai.GenerativeModel({
    modelName: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 1,
      top_p: 0.95,
      top_k: 64,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    },
    systemInstruction: systemInstruction
  });

  const questionsJson = JSON.stringify(questions);
  const response = await model.generate({
    prompt: `Classify these questions and provide additional data:\n${questionsJson}`,
    stopSequences: ["\n"],
  });

  const processedQuestions = JSON.parse(response.text);
  return processedQuestions;
};

export default processQuestionsWithGemini;
