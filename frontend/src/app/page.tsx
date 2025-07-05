'use client';

import CommentList from '@/components/CommentList';
import CommentForm from '@/components/CommentForm';
import { useState, useCallback } from 'react';

export default function Home() {
  const [key, setKey] = useState(0);

  const handleCommentCreated = useCallback(() => {
    setKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Comments</h1>
      <CommentForm onCommentCreated={handleCommentCreated} />
      <CommentList key={key} />
    </div>
  );
}
