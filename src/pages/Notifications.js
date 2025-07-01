import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentFormId, setConsentFormId] = useState(null);
  const [denyReason, setDenyReason] = useState('');
  const [denyError, setDenyError] = useState('');

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

  const handleApproveConsent = async (id) => {
    setConsentFormId(id);
    setShowConsentModal(true);
  };

  const handleConsentApprove = async () => {
    try {
      await apiClient.post(`/VaccinationConsentForm/${consentFormId}/approve`);
      setShowConsentModal(false);
      setConsentFormId(null);
      fetchNotifications();
      alert('Đã xác nhận tiêm chủng thành công!');
    } catch (err) {
      alert('Lỗi khi xác nhận tiêm chủng!');
    }
  };

  const handleConsentDeny = async () => {
    if (!denyReason.trim()) {
      setDenyError('Vui lòng nhập lý do từ chối!');
      return;
    }
    try {
      await apiClient.post(`/VaccinationConsentForm/${consentFormId}/deny`, { Reason: denyReason });
      setShowConsentModal(false);
      setConsentFormId(null);
      setDenyReason('');
      setDenyError('');
      fetchNotifications();
      alert('Đã gửi từ chối tiêm chủng!');
    } catch (err) {
      alert('Lỗi khi gửi từ chối!');
    }
  };

  if (!userID) return <div>Vui lòng đăng nhập để xem thông báo.</div>;
  if (loading) return <div>Đang tải thông báo...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>Thông báo của bạn</h2>
      {/* Modal xác nhận tiêm chủng */}
      {showConsentModal && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 18,
            padding: '36px 32px 28px 32px',
            minWidth: 340,
            maxWidth: '90vw',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            fontFamily: 'Segoe UI, Arial, sans-serif',
            animation: 'fadeInModal 0.25s',
            position: 'relative'
          }}>
            <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, color: '#222', textAlign: 'center' }}>
              Bạn có đồng ý cho con tiêm chủng không?
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 24 }}>
              <button
                onClick={handleConsentApprove}
                style={{
                  background: '#38a169', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 18, fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(56,161,105,0.08)', cursor: 'pointer', transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#2f855a'}
                onMouseOut={e => e.currentTarget.style.background = '#38a169'}
              >
                Đồng ý
              </button>
              <button
                style={{
                  background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 18, fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(229,62,62,0.08)', cursor: 'pointer', transition: 'background 0.2s',
                }}
                onClick={() => setDenyError(denyError ? '' : 'show')}
                onMouseOver={e => e.currentTarget.style.background = '#c53030'}
                onMouseOut={e => e.currentTarget.style.background = '#e53e3e'}
              >
                Từ chối
              </button>
            </div>
            {denyError === 'show' && (
              <div style={{ marginTop: 8, marginBottom: 8 }}>
                <textarea
                  placeholder="Nhập lý do từ chối..."
                  value={denyReason}
                  onChange={e => setDenyReason(e.target.value)}
                  rows={3}
                  style={{ width: '100%', borderRadius: 8, border: '1.5px solid #e2e8f0', padding: 12, fontSize: 16, fontFamily: 'inherit', resize: 'vertical', marginBottom: 8 }}
                />
                <div style={{ color: 'red', fontSize: 14, marginBottom: 8 }}>{denyError && denyError !== 'show' ? denyError : ''}</div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button
                    onClick={handleConsentDeny}
                    style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#c53030'}
                    onMouseOut={e => e.currentTarget.style.background = '#e53e3e'}
                  >
                    Xác nhận từ chối
                  </button>
                  <button
                    onClick={() => { setShowConsentModal(false); setDenyReason(''); setDenyError(''); }}
                    style={{ background: '#a0aec0', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#718096'}
                    onMouseOut={e => e.currentTarget.style.background = '#a0aec0'}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
            {denyError !== 'show' && denyError && <div style={{ color: 'red', marginTop: 8, textAlign: 'center' }}>{denyError}</div>}
            {!denyError && denyError !== 'show' && (
              <button
                onClick={() => { setShowConsentModal(false); setDenyReason(''); setDenyError(''); }}
                style={{ background: '#a0aec0', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, fontWeight: 600, cursor: 'pointer', margin: '0 auto', display: 'block', marginTop: 18, transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = '#718096'}
                onMouseOut={e => e.currentTarget.style.background = '#a0aec0'}
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      )}
      {notifications.length === 0 ? (
        <div>Không có thông báo nào.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map(n => (
            <li key={n.id || n.notificationID} style={{
              background: n.isRead ? '#f0f0f0' : '#e6f7ff',
              marginBottom: 12,
              padding: 16,
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontWeight: n.isRead ? 'normal' : 'bold' }}>{n.title}</div>
              <div style={{ margin: '8px 0' }} dangerouslySetInnerHTML={{ __html: n.message }} />
              <div style={{ fontSize: 12, color: '#888' }}>{new Date(n.createdAt).toLocaleString()}</div>
              {(n.ConsentFormID || n.consentFormID) && n.title !== "Kết quả tiêm chủng của con bạn" && (
                <button
                  style={{ marginLeft: 8, marginTop: 8, padding: '4px 12px', borderRadius: 4, border: 'none', background: '#38a169', color: '#fff', cursor: 'pointer' }}
                  onClick={() => handleApproveConsent(n.ConsentFormID || n.consentFormID)}
                >
                  Xác nhận tiêm chủng
                </button>
              )}
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