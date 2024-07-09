import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link'

interface AuthFormProps {
    mode: 'login' | 'register';
};

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
    const [username, setUsername] = useState('');
    const [classname, setClassname] = useState('');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = mode === 'register' ? { username, classname, email, password } : { email, password };
            const response = await axios.post(`http://localhost:5000/api/users/${mode}`, data);
            console.log(data)
            localStorage.setItem('token', response.data.token);
            router.push('/questions');
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Failed to authenticate");
        }
    };

    return (
        <div className='flex items-center justify-center p-12'>
            <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
                <h2 className='text-2xl font-bold mb-6'>{mode === 'login' ? 'Login' : 'Register'}</h2>
                <form onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <>
                            <div>
                                <label htmlFor="username" className="block text-gray-700">Username</label>
                                <input id="username" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Username" required />
                            </div>
                            <div>
                                <label htmlFor="classname" className="block text-gray-700">Classname</label>
                                <input
                                    id="classname" name="classname" type="text" value={classname} onChange={(e) => setClassname(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Classname" required />
                            </div>
                        </>
                    )}
                    <div className='mb-4'>
                        <label htmlFor='email' className='block text-gray-700'>Email</label>
                        <input
                            id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Email" required />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='password' className='block text-gray-700'>Password</label>
                        <input
                            id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Password" required />
                    </div>
                    {message && <p className='text-red-500 text-sm'>{message}</p>}
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">
                        {mode === 'login' ? 'Login' : 'Register'}
                    </button>
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link href={mode === 'login' ? "/register" : "/login"} className="font-medium text-indigo-600 hover:text-indigo-500">
                                {mode === 'register' ? 'Already have an account? Login' : "Don't have an account? Register"}
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;