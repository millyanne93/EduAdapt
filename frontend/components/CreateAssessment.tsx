import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/router';

interface Questions {
  _id: string;
  text: string;
  options: string[];
  correctOption: number;
  difficulty: number;
  topic: string;
}

const CreateAssessment: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Questions[]>([]);
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState<number | ''>('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (topic) {
      const getQuestions = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get(`http://localhost:5000/api/questions/category/${topic}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setQuestions(response.data);
        } catch (error) {
          setMessage('Failed to load questions');
        }
      };
      getQuestions();
    }
  }, [topic, questions]);

  const handleDeleteQuestion = async (questionId: string) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/questions/${questionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setQuestions(questions.filter(q => q._id !== questionId))
  };

  const handleCreateAssessment = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post('http://localhost:5000/api/assessments/',
        { title, questionIds: selectedQuestions.map((q) => q._id) },
        { headers: { Authorization: `Bearer ${token}`} }
      );
      setMessage('An assessment has been created');
      router.push(`/admin/questions/${response.data._id}`);
    } catch (error) {
      setMessage('Failed to create assessment');
    }
  };

  const handleDeleteQuestionClick = (questionId: string) => {
    return async () => {
      await handleDeleteQuestion(questionId);
      setMessage('Question has been deleted');
    };
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="my-6 p-8 bg-gray-100 min-h-screen">
      <h3 className="text-2xl font-bold text-green-600 mb-6">Create Assessment</h3>
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg"/>
      </div>
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Topic</label>
        <select value={topic} onChange={e => setTopic(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg">
          <option value="">Select a topic</option>
          <option value="Math">Math</option>
          <option value="History">History</option>
          <option value="Science">Science</option>
          <option value="Literature">Literature</option>
          <option value="Geography">Geography</option>
        </select>
      </div>
      {/* <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Rating</label>
        <select value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg">
          <option value="">Select a rating</option>
          {[1, 2, 3, 4, 5].map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div> */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Questions</h2>
        <ul className="space-y-4">
          {questions.slice(0, 20).map((question) => (
            <li key={question._id} className="flex items-center">
              <input type="checkbox" value={question._id}
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedQuestions([...selectedQuestions, question]);
                  } else {
                    setSelectedQuestions(selectedQuestions.filter(q => q._id !== question._id));
                  }
                }} className="mr-4"/>
              <label className="text-lg">
                {question.text}
                <button className="text-red-500 ml-2" onClick={handleDeleteQuestionClick(question._id)}>
                  <FiTrash2 />
                </button>
              </label>
            </li>
          ))}
        </ul>
        {message && <p className="text-red-500 text-sm">{message}</p>}
      </div>
      <button
        onClick={handleCreateAssessment}
        className="mt-6 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Create Assessment
      </button>
    </div>
  );
};

export default CreateAssessment;
