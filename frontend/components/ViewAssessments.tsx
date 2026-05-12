import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import ConfirmModal from '@/components/ConfirmModal';
import { FiTrash2, FiEdit } from 'react-icons/fi';

interface Assessments {
  _id: string;
  title: string;
  createdBy: string;
  questions: {
    _id: string;
    text: string;
    options: string[];
    correctOption: number;
    difficulty: number;
    topic: string;
  }[];
}

const ViewAssessments: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessments[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessments | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAssessments = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/assessments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssessments(response.data);
    };
    fetchAssessments();
  }, []);

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
    setIsModalOpen(true);
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
      <h2 className="text-xl font-semibold mb-4">Assessments</h2>
      <ul className="space-y-4">
        {assessments.map((assessment) => (
          <li key={assessment._id} className="flex justify-between items-center bg-white p-4 mb-2 rounded shadow">
            {assessment.title}
            <div>
              <button className="text-green-500 hover:text-green-700 ml-4">
                <Link href={`/admin/questions/add/${assessment._id}`}>
                  Add Questions
                </Link>
              </button>
              <button className="text-green-500 hover:text-green-700 ml-4">
                <Link href={`/admin/questions/${assessment._id}`}>
                  <FiEdit />
                </Link>
              </button>
              <button className="text-red-500 hover:text-red-700 ml-4" onClick={() => openDeleteModal(assessment)}>
                <FiTrash2 />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {selectedAssessment && (
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDeleteAssessment}
          title="Delete Assessment"
          description="Are you sure you want to delete this assessment?"
        />
      )}
      {message && <p className="text-red-500 text-sm">{message}</p>}
    </div>
  );
};

export default ViewAssessments;
