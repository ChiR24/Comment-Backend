'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    router.push('/login');
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <Link href="/" className="text-xl font-bold">
        CommentApp
      </Link>
      <div className="flex items-center space-x-4">
        {token ? (
          <>
            <Link href="/notifications" className="hover:text-gray-400">
              Notifications
            </Link>
            <button onClick={handleLogout} className="hover:text-gray-400">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-gray-400">
              Login
            </Link>
            <Link href="/register" className="hover:text-gray-400">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
} 