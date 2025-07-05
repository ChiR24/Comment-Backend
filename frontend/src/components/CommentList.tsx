'use client';

import { useEffect, useState } from 'react';
import CommentItem from './CommentItem';

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
  };
  replies: Comment[];
};

export default function CommentList() {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const url = new URL('/comments', process.env.NEXT_PUBLIC_API_URL).toString();
      const res = await fetch(url);
      const data = await res.json();
      setComments(data);
    };
    fetchComments();
  }, []);

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
} 