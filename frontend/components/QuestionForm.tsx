import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Question {
  _id: string;
  text: string;
  options: string[];
}

const QuestionForm: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/questions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(response.data);
      } catch (error) {
        setMessage('Failed to load questions');
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: answer }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/assessments/submit',
        { questions: Object.keys(answers).map((key) => ({ questionId: key, answer: answers[key] })) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      router.push('/results');
    } catch (error) {
      setMessage('Failed to submit assessment');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6">Assessment</h2>
        <form onSubmit={handleSubmit}>
          {questions.map((question) => (
            <div key={question._id} className="mb-4">
              <label className="block text-gray-700">{question.text}</label>
              <div className="mt-2">
                {question.options.map((option, index) => (
                  <label key={index} className="block">
                    <input
                      type="radio"
                      name={question._id}
                      value={option}
                      onChange={() => handleAnswerChange(question._id, option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          {message && <p className="text-red-500 text-sm">{message}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
