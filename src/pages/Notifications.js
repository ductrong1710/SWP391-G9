import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Giả sử userID lưu trong localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userID = user?.userID || user?.UserID || '';

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/Notification/user/${userID}`);
      setNotifications(res.data);
    } catch (err) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userID) fetchNotifications();
  }, [userID]);

  const handleMarkAsRead = async (notificationID) => {
    try {
      await apiClient.post(`/Notification/mark-as-read/${notificationID}`);
      // Cập nhật lại danh sách sau khi đánh dấu đã đọc
      fetchNotifications();
    } catch (err) {
      alert('Lỗi khi đánh dấu đã đọc!');
    }
  };

  if (!userID) return <div>Vui lòng đăng nhập để xem thông báo.</div>;
  if (loading) return <div>Đang tải thông báo...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>Thông báo của bạn</h2>
      {notifications.length === 0 ? (
        <div>Không có thông báo nào.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map(n => (
            <li key={n.notificationID} style={{
              background: n.isRead ? '#f0f0f0' : '#e6f7ff',
              marginBottom: 12,
              padding: 16,
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontWeight: n.isRead ? 'normal' : 'bold' }}>{n.title}</div>
              <div style={{ margin: '8px 0' }}>{n.message}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{new Date(n.createdAt).toLocaleString()}</div>
              {!n.isRead && (
                <button onClick={() => handleMarkAsRead(n.notificationID)} style={{ marginTop: 8, padding: '4px 12px', borderRadius: 4, border: 'none', background: '#3182ce', color: '#fff', cursor: 'pointer' }}>
                  Đánh dấu đã đọc
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications; 