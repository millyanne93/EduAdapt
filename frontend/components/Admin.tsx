import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import ConfirmModal from '@/components/ConfirmModal';
import { FiTrash2, FiEdit } from 'react-icons/fi';

interface Questions {
  _id: string;
  text: string;
  options: string[];
  correctOption: number;
  difficulty: number;
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
  const [rating, setRating] = useState<number | ''>('');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessments | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'assessment' | 'question' | null>(null);
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

  const handleDeleteAssessment = async () => {
    if (!selectedAssessment) return;
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/assessments/${selectedAssessment._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAssessments(assessments.filter(a => a._id !== selectedAssessment._id));
    setIsModalOpen(false);
    setSelectedAssessment(null);
  };

  const openDeleteModal = (assessment: Assessments) => {
    setSelectedAssessment(assessment);
    setModalType('assessment');
    setIsModalOpen(true);
  };

  const handleCreateAssessment = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/assessments/',
        { title, questionIds: selectedQuestions.map((q) => q._id) },
        { headers: { Authorization: `Bearer ${token}`} }
      );
      alert('An assessment has been created');
    } catch (error) {
      setMessage('Failed to create assessments');
    }
  };

  return (
    <div className="my-6 p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Page</h1>
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
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Rating</label>
        <select value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg">
          <option value="">Select a rating</option>
          {[1, 2, 3, 4, 5].map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
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
                <button className="text-red-500 ml-2">Delete</button>
                <button className="text-blue-500 ml-2">Update</button>
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
            <li key={assessment._id} className="flex justify-between items-center bg-white p-4 mb-2 rounded shadow">
              {assessment.title}
              <div>
                <Link href={`/admin/questions/${assessment._id}`} passHref className="text-green-500 hover:text-green-700">
                    <FiEdit />
                </Link>
                <button className="text-red-500 hover:text-red-700 ml-4" onClick={() => openDeleteModal(assessment)}>
                  <FiTrash2 />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {selectedAssessment && modalType === 'assessment' && (
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDeleteAssessment}
          title="Delete Assessment"
          description="Are you sure you want to delete this assessment?"
        />
      )}
    </div>
  )
};

export default Admin;
