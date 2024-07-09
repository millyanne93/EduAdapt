import React from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-green-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-bold">EduAdapt</div>
          <div>
            <Link href="/login" className="text-white mr-4">
                Login
            </Link>
            <Link href="/register" className="text-white">
                Sign Up
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-green-700 p-4 text-white text-center">
        © 2024 EduAdapt. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
