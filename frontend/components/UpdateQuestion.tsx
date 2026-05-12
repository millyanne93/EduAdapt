import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctOption: number;
  difficulty: number;
  topic: string;
}

interface Assessment {
  id: string;
  title: string;
}

const UpdateQuestion: React.FC = () => {
  const router = useRouter();
  const { id, assessmentId: initialAssessmentId } = router.query;
  const [question, setQuestion] = useState<Question | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(initialAssessmentId as string);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/questions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestion(response.data.response);
        setAssessments(response.data.assessments);
        if (!selectedAssessmentId && response.data.assessments.length > 0) {
          setSelectedAssessmentId(response.data.assessments[0].id);
        }
      } catch (error) {
        setMessage('Failed to load question');
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id, selectedAssessmentId]);

  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/questions/${id}`, question, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Question has been updated');
      router.push(`/admin/questions/${selectedAssessmentId}`);
    } catch (error) {
      setMessage('Failed to update question');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuestion(prevQuestion => prevQuestion ? { ...prevQuestion, [name]: value } : prevQuestion);
  };

  const handleOptionChange = (index: number, value: string) => {
    setQuestion(prevQuestion => {
      if (!prevQuestion) return prevQuestion;
      const newOptions = [...prevQuestion.options];
      newOptions[index] = value;
      return { ...prevQuestion, options: newOptions };
    });
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-6 p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Update Question</h1>
      <form onSubmit={handleUpdateQuestion}>
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Text</label>
          <textarea
            name="text"
            value={question.text}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Options</label>
          {question.options.map((option, index) => (
            <input
              key={index}
              name={`options.${index}`}
              value={option}
              onChange={e => handleOptionChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            />
          ))}
        </div>
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Correct Option</label>
          <select
            name="correctOption"
            value={question.correctOption}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            {[1, 2, 3, 4].map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Difficulty</label>
          <select
            name="difficulty"
            value={question.difficulty}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            {[1, 2, 3, 4, 5].map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Topic</label>
          <input
            name="topic"
            value={question.topic}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        {assessments.length > 1 && (
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Select Assessment</label>
            <select
              value={selectedAssessmentId || ''}
              onChange={(e) => setSelectedAssessmentId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              {assessments.map((assessment) => (
                <option key={assessment.id} value={assessment.id}>
                  {assessment.title}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          type="submit"
          className="mt-6 p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Update Question
        </button>
      </form>
      {message && <p className="text-red-500 text-sm">{message}</p>}
    </div>
  );
};

export default UpdateQuestion;
