import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AddQuestions: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');

  const handleAddQuestion = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/api/questions',
        {
          text: questionText,
          options,
          correctOption,
          topic,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Question added successfully');
    } catch (error) {
      setMessage('Failed to add question');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Question</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium">Question Text</label>
        <input
          type="text"
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
          className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Options</label>
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={e => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
            className="mt-1 block w-full border border-gray-300 p-2 rounded-md mb-2"
          />
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Correct Option</label>
        <input
          type="number"
          value={correctOption ?? ''}
          onChange={e => setCorrectOption(parseInt(e.target.value, 10))}
          className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Add Topic</label>
        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
        />
      </div>
      {message && <p className="text-red-500 text-sm">{message}</p>}
      <button onClick={handleAddQuestion} className="bg-green-500 text-white p-2 rounded-md">
        Add Question
      </button>
    </div>
  );
};

export default AddQuestions;
