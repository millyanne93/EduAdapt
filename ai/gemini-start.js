import 'dotenv/config'; // Automatically loads .env file
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
  
    const prompt = "Write a story about a magic backpack."
  
    const { totalTokens } = await model.countTokens(prompt);
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }
  
  run();
