// components/AllQuestions.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctOption: number;
  difficulty: number;
  topic: string;
}

const AllQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/questions', {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, category, difficulty },
        });
        console.log('Response data:', response.data); // Log the response data
        if (Array.isArray(response.data)) {
          setQuestions(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setQuestions([]);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestions([]);
      }
    };
    fetchQuestions();
  }, [page, category, difficulty]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">All Questions</h1>
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Category:</label>
        <select
          value={category}
          onChange={handleCategoryChange}
          className="bg-white border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="">All</option>
          <option value="Math">Math</option>
          <option value="Science">Science</option>
          <option value="Geography">Geography</option>
          <option value="Literature">Literature</option>
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Difficulty:</label>
        <select
          value={difficulty}
          onChange={handleDifficultyChange}
          className="bg-white border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="">All</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div className="space-y-4">
        {questions.length > 0 ? (
          questions.map((question) => (
            <div key={question._id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{question.text}</h2>
              <p className="text-gray-700 mb-1">Difficulty: {question.difficulty}</p>
              <p className="text-gray-700">Category: {question.topic}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-700">No questions found.</p>
        )}
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllQuestions;
