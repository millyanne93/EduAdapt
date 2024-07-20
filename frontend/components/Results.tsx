import { useEffect, useState } from 'react';
import axios from 'axios';

interface Responses {
  questionId: string;
  selectedOption: number;
  timeSpent: number;
}

interface Assessment {
  _id: string;
  title: string;
  questions: string[];
  createdBy: string;
}

interface TestResult {
  _id: string;
  userId: string;
  testId: Assessment;
  responses: Responses[];
  score: number;
  totalTimeSpent: number;
  completedAt: string;
}

const Results: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getResults = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/testresults/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(response.data);
      } catch (error) {
        setMessage('Couldn\'t get results');
      }
    };
    getResults();
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-green-600 mb-6 text-center">Your Results</h1>
        <ul className="space-y-4">
          {results.map(result => (
            <li key={result._id} className="p-4 bg-gray-50 shadow rounded-lg">
              <p className="text-lg font-semibold">Test: {result.testId.title}</p>
              <div className="flex items-center">
                <p className="text-lg">Score: </p>
                <span className="ml-2 bg-green-500 text-white text-lg font-semibold py-1 px-3 rounded-full">
                  {result.score}
                </span>
              </div>
              <p className="text-lg">Total Time Spent: {formatTime(result.totalTimeSpent)}</p>
              <p className="text-lg mt-4">{result.score >= 80 ? "Great job! Keep up the good work!" : "Don't worry, keep practicing and you'll improve!"}</p>
            </li>
          ))}
        </ul>
        {message && <p className="text-red-500 text-sm mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default Results;