'use client';

import { useState } from 'react';

export default function CommentForm({ parentId, onCommentCreated }: { parentId?: string; onCommentCreated: () => void }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      // Handle not authenticated
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, parentId }),
    });

    if (res.ok) {
      setContent('');
      onCommentCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Write a comment..."
        required
      />
      <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Post Comment
      </button>
    </form>
  );
} 