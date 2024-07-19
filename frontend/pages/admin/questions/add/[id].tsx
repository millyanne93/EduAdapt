import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AddQuestion: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // assessment ID
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<number>(1);
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');

  const handleAddQuestion = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/api/assessments/${id}/questions`, {
        text,
        options,
        correctOption,
        difficulty,
        topic,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Question added successfully');
      router.push(`/admin/questions/${id}`);
    } catch (error) {
      setMessage('Failed to add question');
    }
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
      <h1 className="text-2xl font-bold mb-6">Add Question</h1>
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Question Text</label>
        <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
      </div>
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Options</label>
        {options.map((option, index) => (
          <input key={index} type="text" value={option} onChange={e => {
            const newOptions = [...options];
            newOptions[index] = e.target.value;
            setOptions(newOptions);
          }} className="w-full p-2 border border-gray-300 rounded-lg mb-2" />
        ))}
      </div>
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Correct Option (1-4)</label>
        <select value={correctOption} onChange={e => setCorrectOption(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg">
          {[1, 2, 3, 4].map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Difficulty (1-5)</label>
        <select value={difficulty} onChange={e => setDifficulty(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg">
          {[1, 2, 3, 4, 5].map(diff => (
            <option key={diff} value={diff}>{diff}</option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Topic</label>
        <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
      </div>
      <button onClick={handleAddQuestion} className="mt-6 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600">
        Add Question
      </button>
      {message && <p className="text-red-500 text-sm">{message}</p>}
    </div>
  );
};

export default AddQuestion;
