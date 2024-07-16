import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
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

const AssessmentQuestions: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [assessment, setAssessment] = useState<Assessments | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Questions | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAssessment = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/assessments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssessment(response.data);
      } catch (error) {
        setMessage('Failed to load assessment');
      }
    };

    if (id) {
      fetchAssessment();
    }
  }, [id]);

  const handleDeleteQuestion = (questionId: string) => {
    if (!assessment) return;
    setAssessment({
      ...assessment,
      questions: assessment.questions.filter(q => q._id !== questionId)
    });
    setIsModalOpen(false);
  };

  const openDeleteModal = (question: Questions) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleUpdateQuestion = (question: Questions) => {
    router.push(`/admin/questions/update/${question._id}`);
  };

  return (
    <div className="my-6 p-8 bg-gray-100 min-h-screen">
      {assessment && (
        <>
          <h1 className="text-2xl font-bold mb-6">{assessment.title} - Questions</h1>
          <button className="text-green-500 hover:text-green-700 mb-4">
            <FiEdit /> Add Question
          </button>
          <ul className="space-y-4">
            {assessment.questions.map((question) => (
              <li key={question._id} className="flex justify-between items-center bg-white p-4 mb-2 rounded shadow">
                {question.text}
                <div>
                  <button className="text-blue-500 hover:text-blue-700" onClick={() => handleUpdateQuestion(question)}>
                    <FiEdit />
                  </button>
                  <button className="text-red-500 hover:text-red-700 ml-4" onClick={() => openDeleteModal(question)}>
                    <FiTrash2 />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {selectedQuestion && (
            <ConfirmModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={() => handleDeleteQuestion(selectedQuestion._id)}
              title="Remove Question"
              description="Are you sure you want to remove this question from the assessment?"
            />
          )}
        </>
      )}
      {message && <p className="text-red-500 text-sm">{message}</p>}
    </div>
  );
};

export default AssessmentQuestions;
