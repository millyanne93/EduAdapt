import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to EduAdapt</h1>
        <div className="flex flex-col space-y-4">
          <Link href="/login" className="w-full bg-blue-500 text-white p-2 rounded text-center">
            Login
          </Link>
          <Link href="/register" className="w-full bg-green-500 text-white p-2 rounded text-center">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
