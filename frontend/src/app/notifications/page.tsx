'use client';

import { useEffect, useState } from 'react';

type Notification = {
  id: string;
  read: boolean;
  createdAt: string;
  comment: {
    id: string;
    content: string;
    user: {
      username: string;
    };
  };
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch('http://localhost:3000/notifications', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      setNotifications(data);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    await fetch(`http://localhost:3000/notifications/${id}/read`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotifications();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>
      <div>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 my-2 rounded ${
                notification.read ? 'bg-gray-100' : 'bg-blue-100'
              }`}
            >
              <p>
                <strong>{notification.comment.user.username}</strong> replied to your comment:
              </p>
              <p className="italic">&quot;{notification.comment.content}&quot;</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
              {!notification.read && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="text-sm text-blue-500 mt-2"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))
        ) : (
          <p>You have no notifications.</p>
        )}
      </div>
    </div>
  );
} 