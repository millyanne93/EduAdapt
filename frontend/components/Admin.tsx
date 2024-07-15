import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Questions {
  _id: string;
  text: string;
  options: string[];
  correctOption: number;
  difficulty: string;
  topic: string;
}

interface Assessments {
  _id: string;
  title: string;
  questions: Questions[];
  createdBy: string;
}

const Admin = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [assessments, setAssessments] = useState<Assessments[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Questions[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (topic) {
      const getQuestions = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get(`http://localhost:5000/api/questions/${topic}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setQuestions(response.data);
        } catch (error) {
          setMessage('Failed to load questions');
        }
      };
      getQuestions();
    }
    const fetchAssessments = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/assessments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssessments(response.data);
    };

    fetchAssessments();
  }, [topic, assessments]);

  const handleCreateAssessment = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/assessments/',
        { title, questionIds: selectedQuestions.map((q) => q._id) },
        { headers: { Authorization: `Bearer ${token}`} }
      );
    } catch (error) {
      setMessage('Failed to create assessments');
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-green-600 mb-6">Create Assessment</h1>
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg"/>
      </div>
      <div>
        <label className="block text-lg font-semibold mb-2">Topic</label>
        <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg"/>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Questions</h2>
        <ul className="space-y-4">
          {questions.map((question) => (
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
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Assessments</h2>
        <ul className="space-y-4">
          {assessments.map((assessment) => (
            <li key={assessment._id} className="p-4 bg-white shadow rounded-lg">
              {assessment.title} <Link href={`/admin/questions/${assessment._id}`}>Add Questions</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
};

export default Admin;
