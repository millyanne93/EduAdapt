import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import ConfirmModal from '@/components/ConfirmModal';
import { FiTrash2, FiEye } from 'react-icons/fi';

interface User {
  _id: string;
  username: string;
  email: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        setMessage('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  const handleViewResults = (userId: string) => {
    router.push(`/admin/users/${userId}/results`);
  };

  const handleDeleteUser = async (userId: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user._id !== userId));
      setMessage('User has been deleted');
    } catch (error) {
      setMessage('Failed to delete user');
    } finally {
      setIsModalOpen(false);
    }
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
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
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <ul className="space-y-4">
        {users.map(user => (
          <li key={user._id} className="flex justify-between items-center bg-white p-4 mb-2 rounded shadow">
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div>
              <button className="text-blue-500 hover:text-blue-700" onClick={() => handleViewResults(user._id)}>
                <FiEye />
              </button>
              <button className="text-red-500 hover:text-red-700 ml-4" onClick={() => openDeleteModal(user)}>
                <FiTrash2 />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {selectedUser && (
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => handleDeleteUser(selectedUser._id)}
          title="Delete User"
          description={`Are you sure you want to delete ${selectedUser.username}?`}
        />
      )}
      {message && <p className="text-red-500 text-sm">{message}</p>}
    </div>
  );
};

export default Users;