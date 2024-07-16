import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Questions {
  _id: string;
  text: string;
  options: string[];
  correctOption: number;
  difficulty: number;
  topic: string;
}

const UpdateQuestion: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [question, setQuestion] = useState<Questions | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/questions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestion(response.data);
      } catch (error) {
        setMessage('Failed to load question');
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!question) return;
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/questions/${question._id}`, question, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Question updated successfully');
    } catch (error) {
      setMessage('Failed to update question');
    }
  };

  return (
    <div className="my-6 p-8 bg-gray-100 min-h-screen">
      {question && (
        <>
          <h1 className="text-2xl font-bold mb-6">Update Question</h1>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Question Text</label>
            <input type="text" value={question.text} onChange={e => setQuestion({ ...question, text: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg"/>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Options</label>
            {question.options.map((option, index) => (
              <input key={index} type="text" value={option} onChange={e => {
                const newOptions = [...question.options];
                newOptions[index] = e.target.value;
                setQuestion({ ...question, options: newOptions });
              }} className="w-full p-2 border border-gray-300 rounded-lg mb-2"/>
            ))}
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Correct Option</label>
            <input type="number" value={question.correctOption} onChange={e => setQuestion({ ...question, correctOption: Number(e.target.value) })} className="w-full p-2 border border-gray-300 rounded-lg"/>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Difficulty</label>
            <input type="number" value={question.difficulty} onChange={e => setQuestion({ ...question, difficulty: Number(e.target.value) })} className="w-full p-2 border border-gray-300 rounded-lg"/>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Topic</label>
            <input type="text" value={question.topic} onChange={e => setQuestion({ ...question, topic: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg"/>
          </div>
          <button onClick={handleUpdate} className="mt-6 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600">Save</button>
          {message && <p className="text-red-500 text-sm mt-4">{message}</p>}
        </>
      )}
    </div>
  );
};

export default UpdateQuestion;
