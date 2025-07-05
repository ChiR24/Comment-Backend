'use client';

import { useState } from 'react';

export default function CommentForm({
  parentId,
  onCommentCreated,
}: {
  parentId?: number;
  onCommentCreated?: () => void;
}) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. User might be logged out.');
      return;
    }

    const url = new URL(
      '/comments',
      process.env.NEXT_PUBLIC_API_URL,
    ).toString();

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, parentId }),
    });

    if (res.ok) {
      setContent('');
      if (onCommentCreated) {
        onCommentCreated();
      }
    } else {
      console.error('Failed to post comment:', await res.text());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        className="w-full p-2 border rounded text-black"
        rows={3}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Write a comment..."></textarea>
      <button
        type="submit"
        className="px-4 py-2 mt-2 text-white bg-blue-600 rounded hover:bg-blue-700">
        Post Comment
      </button>
    </form>
  );
} 