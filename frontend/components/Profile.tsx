import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: string;
  testResults: string[];
}

interface Assessment {
  _id: string;
  title: string;
  questions: string[];
  createdBy: string;
}

const Profile: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getAssessments = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/assessments/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssessments(response.data);
      } catch (error) {
        setMessage('Failed to load assessments');
      }
    };

    const getUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        setMessage('Failed to load user');
      }
    }
    getAssessments();
    getUser();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-green-600 mb-6">Welcome, {user ? user.username : '...'}</h1>
      <h2 className="text-xl font-semibold mb-4">Assessments</h2>
      <ul className="space-y-4">
        {assessments.map((assessment) => (
          <li key={assessment._id} className="p-4 bg-white shadow rounded-lg">{assessment.title}</li>
        ))}
      </ul>
      {message && <p className="text-red-500 text-sm">{message}</p>}
    </div>
  );
};

export default Profile;