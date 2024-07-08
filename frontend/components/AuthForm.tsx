import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface AuthFormProps {
    mode: 'login' | 'register';
};

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault;
        try {
            const response = await axios.post(`http:localhost:5000/api/users/${mode}`, {
                email,
                password,
            });
            localStorage.set('token', response.data.token);
            router.push('/questions');
        } catch {
            setMessage("Failed to authenticate");
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
                <h2 className='text-2xl font-bold mb-6'>{mode === 'login' ? 'Login' : 'Register'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" required />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" required />
                    </div>
                    {message && <p className='text-red-500 text-sm'>{message}</p>}
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">
                        {mode === 'login' ? 'Login' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;