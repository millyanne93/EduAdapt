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
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      const getAssessment = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get('http://localhost:5000/api/assessments/${id}', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAssessment(response.data);
        } catch (error) {
          setMessage('Couldn\'t get assessments');
        }
      };
      getAssessment();
    }
  }, [id]);

  const handleAnswer = async (questionId: string, selectedOption: number) => {
    if (!assessment) return;
    setResponses([ ...responses, { questionId, selectedOption, timeSpent: 0 }]);
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const score = responses.reduce((acc, res) => {
        const question = assessment.questions.find(q => q._id === res.questionId);
        return acc + (question && question.correctOption === res.selectedOption ? 1 : 0);
      }, 0);
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post('http://localhost:5000//api/testresults',
          { testId: id, responses, score },
          { headers: { Authorization: `Bearer ${token}`} }
        );
      } catch (error) {
        setMessage('Failed to create assessments');
      }
      router.push('/results');
    }
  }
  if (!assessment) return <div>Loading...</div>;

  const currentQuestion = assessment.questions[currentQuestionIndex];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-green-600 mb-6">{assessment.title}</h1>
      <h2 className="text-xl font-semibold mb-4">Question {currentQuestionIndex + 1}</h2>
      <p className="text-lg mb-6">{currentQuestion.text}</p>
      <div className="space-y-4">
      {currentQuestion.options.map((option, index) => (
        <button key={index} onClick={() => handleAnswer(currentQuestion._id, index)}>
          {option}
        </button>
      ))}
      </div>
      {message && <p className="text-red-500 text-sm mt-4">{message}</p>}
    </div>
  );
};

export default Test;