'use client';

import { useState } from 'react';
import { Comment } from './CommentList';
import CommentForm from './CommentForm';
import { useRouter } from 'next/navigation';

export default function CommentItem({ comment }: { comment: Comment }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const router = useRouter();

  const handleCommentCreated = () => {
    setShowReplyForm(false);
    // A simple way to refresh the page to show the new comment.
    // A more advanced implementation might use global state management.
    router.refresh();
  };

  return (
    <div className="p-4 my-2 bg-gray-100 rounded">
      <div className="flex items-center mb-2">
        <p className="font-bold">{comment.user.username}</p>
        <p className="ml-2 text-sm text-gray-500">
          {new Date(comment.createdAt).toLocaleString()}
        </p>
      </div>
      <p className="my-2 text-gray-800">{comment.content}</p>
      <button
        onClick={() => setShowReplyForm(!showReplyForm)}
        className="text-sm text-blue-500 mt-2"
      >
        Reply
      </button>
      {showReplyForm && (
        <CommentForm
          parentId={comment.id}
          onCommentCreated={handleCommentCreated}
        />
      )}
      {comment.replies && (
        <div className="pl-4 mt-2 border-l-2 border-gray-300">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
} 