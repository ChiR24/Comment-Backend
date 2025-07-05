'use client';

import { useState } from 'react';
import { Comment } from './CommentList';
import CommentForm from './CommentForm';

export default function CommentItem({ comment }: { comment: Comment }) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleCommentCreated = () => {
    setShowReplyForm(false);
    // This is a bit of a hack to force a re-render of the parent
    // A better solution would be to use a state management library
    window.location.reload();
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
        <CommentForm parentId={comment.id} onCommentCreated={handleCommentCreated} />
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