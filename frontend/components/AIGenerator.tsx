import React, { useState } from 'react';
import axios from 'axios';

interface Questions {
  _id: string;
  text: string;
  options: string[];
  correctOption: number;
  difficulty: number;
  topic: string;
}

const AIQuestionGenerator: React.FC = () => {
  const [difficulty, setDifficulty] = useState<number>(1);
  const [topic, setTopic] = useState<string>('');
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(1);
  const [generatedQuestions, setGeneratedQuestions] = useState<Questions[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/questions/generate',
        { difficulty, topic, numberOfQuestions },
        { headers: { Authorization: `Bearer ${token}` }}
      );
    setGeneratedQuestions(response.data);
  } catch (error) {
    console.error('Error generating questions:', error);
  }
};

return (
  <div className="p-6 bg-gray-100 min-h-screen">
    <h1 className="text-3xl font-bold mb-4">Generate Questions</h1>
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Difficulty Level:</label>
        <input
          type="number"
          value={difficulty}
          onChange={(e) => setDifficulty(Number(e.target.value))}
          min="1"
          max="5"
          className="bg-white border border-gray-300 rounded-md shadow-sm p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Topic:</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="bg-white border border-gray-300 rounded-md shadow-sm p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Number of Questions:</label>
        <input
          type="number"
          value={numberOfQuestions}
          onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
          min="1"
          className="bg-white border border-gray-300 rounded-md shadow-sm p-2 w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600"
      >
        Generate Questions
      </button>
    </form>
    <div className="mt-6">
      {generatedQuestions.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Generated Questions</h2>
          <div className="space-y-4">
            {generatedQuestions.map((question, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{question.text}</h3>
                <p className="text-gray-700 mb-1">Difficulty: {question.difficulty}</p>
                <p className="text-gray-700">Category: {question.topic}</p>
                <ul className="list-disc pl-5">
                  {question.options.map((option, idx) => (
                    <li key={idx} className="text-gray-700">{option}</li>
                  ))}
                </ul>
                <p className="text-gray-700">Correct Option Index: {question.correctOption}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default AIQuestionGenerator;
