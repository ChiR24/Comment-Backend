'use client';

import { useCallback, useEffect, useState } from 'react';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [key, setKey] = useState(0); // Used to force re-render of CommentList

  const handleCommentCreated = useCallback(() => {
    setKey(prevKey => prevKey + 1);
  }, []);

  useEffect(() => {
    // This will run only on the client side
    setToken(localStorage.getItem('token'));
  }, []);

  return (
    <main>
      <h1 className="text-3xl font-bold mb-4">Comments</h1>
      {token ? (
        <>
          <CommentForm onCommentCreated={handleCommentCreated} />
          <CommentList key={key} />
        </>
      ) : (
        <p>Please log in to view and post comments.</p>
      )}
    </main>
  );
}
