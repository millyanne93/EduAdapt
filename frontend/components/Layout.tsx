import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Sidebar from './SideBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/');
  };
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-green-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-bold">
            <Link href="/">EduAdapt</Link>
          </div>
          <div>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-white">
                Logout
            </button>
            ) : (
              <>
                <Link href="/login" className="text-white mr-4">
                    Login
                </Link>
                <Link href="/register" className="text-white">
                    Sign Up
                </Link>
              </>
          )}
          </div>
        </div>
      </nav>
      <div className='flex flex-1'>
        {isAdminPage && <Sidebar />}
        <main className="flex-1 container mx-auto">
          {children}
        </main>
      </div>
      <footer className="bg-green-700 p-4 text-white text-center">
        © 2024 EduAdapt. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
