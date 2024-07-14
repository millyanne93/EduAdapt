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

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-green-600 mb-6">Your Results</h1>
      <ul className="space-y-4">
        {results.map(result => (
          <li key={result._id} className="p-4 bg-white shadow rounded-lg">
            <p className="text-lg font-semibold">Test: {result.testId.title}</p>
            <p className="text-lg">Score: {result.score}</p>
          </li>
        ))}
      </ul>
      {message && <p className="text-red-500 text-sm mt-4">{message}</p>}
    </div>
  );
};

export default Results;