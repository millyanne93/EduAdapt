import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Responses {
  questionId: string;
  selectedOption: number;
  timeSpent: number;
}

interface Assessment {
  _id: string;
  title: string;
  questions: Question[];
  createdBy: string;
}

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctOption: number;
  difficulty: string;
  topic: string;
}

const Test: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [responses, setResponses] = useState<Responses[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [message, setMessage] = useState('');
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (id) {
      const getAssessment = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get(`http://localhost:5000/api/assessments/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAssessment(response.data);
        } catch (error) {
          setMessage('Couldn\'t get assessment');
        }
      };
      getAssessment();
    }
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0) return;
  
    const timerId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
  
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleAnswer = async (questionId: string, selectedOption: number) => {
    if (!assessment) return;
  
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
  
    const newResponses = [...responses, { questionId, selectedOption, timeSpent }];
  
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setResponses(newResponses);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setStartTime(Date.now());
    } else {
      const score = newResponses.reduce((acc, res) => {
        const question = assessment.questions.find(q => q._id === res.questionId);
        return acc + (question && question.correctOption === res.selectedOption ? 1 : 0);
      }, 0);
  
      const token = localStorage.getItem('token');
      try {
        await axios.post('http://localhost:5000/api/testresults/',
          { testId: id, responses: newResponses, score },
          { headers: { Authorization: `Bearer ${token}`} }
        );
      } catch (error) {
        setMessage('Failed to create test results');
      }
      router.push('/result');
    }
  };

  if (!assessment) return <div>Loading...</div>;

  const currentQuestion = assessment.questions[currentQuestionIndex];

  return (
    <div className="p-8 my-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-md min-h-screen flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">{assessment.title}</h1>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Question {currentQuestionIndex + 1}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold">Time Left:</span>
            <div className="bg-green-500 text-white font-semibold py-2 px-4 rounded-full shadow-md">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
        <p className="text-lg mb-6 bg-white p-4 rounded-lg shadow">{currentQuestion.text}</p>
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button key={index}
              onClick={() => handleAnswer(currentQuestion._id, index)}
              className="bg-green-500 text-white p-2 rounded-md w-full hover:bg-green-600 transition duration-300">
              {option}
            </button>
          ))}
        </div>
        {message && <p className="text-red-500 text-sm mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default Test;
