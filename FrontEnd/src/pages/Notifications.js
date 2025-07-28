import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import './Notifications.css';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHealthCheckModal, setShowHealthCheckModal] = useState(false);
  const [selectedConsentFormId, setSelectedConsentFormId] = useState(null);
  const [denyReason, setDenyReason] = useState('');
  const [denyError, setDenyError] = useState('');
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [selectedVaccineConsentFormId, setSelectedVaccineConsentFormId] = useState(null);
  const [vaccineDenyReason, setVaccineDenyReason] = useState('');
  const [vaccineDenyError, setVaccineDenyError] = useState('');

  const fetchNotifications = async () => {
    try {
      if (!user || !user.userID) return;
      const res = await apiClient.get(`/Notification/user/${user.userID}`);
      setNotifications(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    console.log('Notifications useEffect, notifications:', notifications);
  }, [notifications]);

  const handleApproveHealthCheck = async (consentFormId) => {
    try {
      await apiClient.post(`/HealthCheckConsentForm/${consentFormId}/approve`);
      alert('Đã xác nhận đồng ý khám sức khỏe!');
      fetchNotifications();
    } catch (err) {
      alert('Lỗi khi xác nhận đồng ý!');
    }
  };

  const handleDenyHealthCheck = async (consentFormId, reason) => {
    try {
      await apiClient.post(`/HealthCheckConsentForm/${consentFormId}/deny`, { Reason: reason });
      alert('Đã gửi từ chối khám sức khỏe!');
      fetchNotifications();
    } catch (err) {
      alert('Lỗi khi gửi từ chối!');
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await apiClient.post(`/Notification/mark-as-read/${notificationId}`);
      fetchNotifications();
    } catch (err) {
      alert('Lỗi khi đánh dấu đã đọc!');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Lấy danh sách ID của các thông báo chưa đọc
      const unreadNotifications = notifications.filter(n => !n.isRead);
      const unreadIds = unreadNotifications.map(n => n.notificationID);
      
      if (unreadIds.length === 0) {
        // Không hiển thị alert khi không có thông báo chưa đọc
        return;
      }

      // Gọi API để đánh dấu từng thông báo đã đọc
      const promises = unreadIds.map(id => 
        apiClient.post(`/Notification/mark-as-read/${id}`)
      );
      
      await Promise.all(promises);
      
      alert('Đã đánh dấu tất cả thông báo là đã đọc!');
      fetchNotifications();
    } catch (err) {
      console.error('Lỗi khi đánh dấu tất cả đã đọc:', err);
      alert('Lỗi khi đánh dấu tất cả đã đọc!');
    }
  };

  const handleApproveConsent = async (consentFormId) => {
    try {
      await apiClient.post(`/VaccinationConsentForm/${consentFormId}/approve`);
      alert('Đã xác nhận đồng ý tiêm chủng!');
      fetchNotifications();
    } catch (err) {
      // Kiểm tra lỗi đã qua ngày tiêm chủng
      const msg = err?.response?.data?.message || err?.response?.data || err?.message || '';
      if (msg && msg.toLowerCase().includes('past vaccination plan')) {
        alert('Kế hoạch đã qua ngày tiêm chủng, không thể xác nhận!');
      } else {
        alert('Lỗi khi xác nhận đồng ý tiêm chủng!');
      }
    }
  };

  const handleDenyConsent = async (consentFormId, reason) => {
    try {
      await apiClient.post(`/VaccinationConsentForm/${consentFormId}/deny`, { Reason: reason });
      alert('Đã gửi từ chối tiêm chủng!');
      fetchNotifications();
    } catch (err) {
      alert('Lỗi khi gửi từ chối tiêm chủng!');
    }
  };

  // Helper functions
  const getNotificationIcon = (notification) => {
    if (notification.title && notification.title.toLowerCase().includes('sức khỏe')) {
      return 'fas fa-heartbeat';
    } else if (notification.title && notification.title.toLowerCase().includes('tiêm chủng')) {
      return 'fas fa-syringe';
    } else if (notification.title && notification.title.toLowerCase().includes('thuốc')) {
      return 'fas fa-pills';
    }
    return 'fas fa-bell';
  };

  const getNotificationCategory = (notification) => {
    if (notification.title && notification.title.toLowerCase().includes('sức khỏe')) {
      return { class: 'health-check', text: 'Khám sức khỏe', categoryClass: 'category-health' };
    } else if (notification.title && notification.title.toLowerCase().includes('tiêm chủng')) {
      return { class: 'vaccination', text: 'Tiêm chủng', categoryClass: 'category-vaccination' };
    } else if (notification.title && notification.title.toLowerCase().includes('thuốc')) {
      return { class: 'medication', text: 'Thuốc', categoryClass: 'category-medication' };
    }
    return { class: '', text: 'Thông báo', categoryClass: 'category-general' };
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return `Hôm qua, ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN') + ', ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Thêm hàm kiểm tra notification đã có kết quả hoặc là thông báo kết quả
  function hasResult(n) {
    // Nếu notification có trường resultStatus hoặc isConfirmed hoặc trạng thái đã hoàn thành, thì không hiện nút xác nhận
    if (n.resultStatus === 'Completed' || n.resultStatus === 'Hoàn thành' || n.isConfirmed === true) return true;
    // Nếu tiêu đề thông báo chứa từ 'kết quả' thì cũng không hiện nút xác nhận
    if (n.title && n.title.toLowerCase().includes('kết quả')) return true;
    return false;
  }

  // Calculate statistics - chỉ tính thông báo chưa đọc
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="container py-4">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Đang tải thông báo...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="container py-4">
        {/* Header with Statistics */}
        <div className="notifications-header fade-in-up">
          <h2>
            <i className="fas fa-bell me-3"></i>
            Trung tâm thông báo
          </h2>
          <div className="notifications-stats">
            <div className="stat-item">
              <span className="stat-number">{unreadCount}</span>
              <span className="stat-label">Thông báo chưa đọc</span>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="empty-state fade-in-up">
            <div className="empty-icon">
              <i className="fas fa-bell-slash"></i>
            </div>
            <div className="empty-title">Không có thông báo nào</div>
            <div className="empty-message">Bạn chưa có thông báo nào. Các thông báo mới sẽ hiển thị ở đây.</div>
          </div>
        ) : (
          <>
            {/* Nút đánh dấu đọc hết tất cả - ở trên bên phải */}
            <div className="mark-all-read-header fade-in-up" style={{animationDelay: '0.2s'}}>
              <button 
                className={`btn-mark-all-read-header ${unreadCount === 0 ? 'disabled' : ''}`}
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <i className="fas fa-check-double"></i>
                {unreadCount > 0 ? 'ĐÁNH DẤU ĐỌC HẾT TẤT CẢ' : 'TẤT CẢ ĐÃ ĐỌC'}
              </button>
            </div>
            
            <ul className="notifications-list">
            {notifications.map((n, idx) => {
              const consentFormId = n.ConsentFormID || n.consentFormID || n.consentformid;
              const uniqueKey = n.notificationID ? n.notificationID : `notif-${idx}`;
              const category = getNotificationCategory(n);
              const iconClass = getNotificationIcon(n);
              
              return (
                <li 
                  key={uniqueKey} 
                  className={`notification-item ${!n.isRead ? 'unread' : ''} ${category.class} fade-in-up`}
                  style={{animationDelay: `${idx * 0.1}s`}}
                >
                  {!n.isRead && <div className="priority-high"></div>}
                  
                  <div className="notification-content">
                    <div className="notification-header">
                      <div className="d-flex align-items-start">
                        <div className={`notification-icon ${category.class}`}>
                          <i className={iconClass}></i>
                        </div>
                        <div className="flex-grow-1">
                          <div className={`notification-category ${category.categoryClass}`}>
                            {category.text}
                          </div>
                          <div className="notification-title">{n.title}</div>
                          <div className="notification-message">{n.message}</div>
                        </div>
                      </div>
                      <div className="notification-meta">
                        <div className="notification-time">
                          <i className="fas fa-clock me-1"></i>
                          {formatDateTime(n.createdAt)}
                        </div>
                        <div className={`notification-status ${n.isRead ? 'status-read' : 'status-unread'}`}>
                          {n.isRead ? 'Đã đọc' : 'Chưa đọc'}
                        </div>
                      </div>
                    </div>

                    <div className="notification-actions">
                      {/* Health Check Confirmation Button */}
                      {n.title && n.title.toLowerCase().includes('sức khỏe') && consentFormId && !hasResult(n) && (
                        <button
                          className="btn-notification btn-confirm"
                          onClick={() => {
                            setSelectedConsentFormId(consentFormId);
                            setShowHealthCheckModal(true);
                          }}
                        >
                          <i className="fas fa-heartbeat"></i>
                          Xác nhận khám sức khỏe
                        </button>
                      )}

                      {/* Vaccination Confirmation Button */}
                      {n.title && n.title.toLowerCase().includes('tiêm chủng') && (n.ConsentFormID || n.consentFormID) && !hasResult(n) && (
                        <button
                          className="btn-notification btn-confirm"
                          onClick={() => {
                            setSelectedVaccineConsentFormId(n.ConsentFormID || n.consentFormID);
                            setShowVaccineModal(true);
                          }}
                        >
                          <i className="fas fa-syringe"></i>
                          Xác nhận tiêm chủng
                        </button>
                      )}

                      {/* Mark as Read Button */}
                      {!n.isRead && (
                        <button 
                          className="btn-notification btn-mark-read"
                          onClick={() => handleMarkAsRead(n.notificationID)}
                        >
                          <i className="fas fa-check"></i>
                          Đánh dấu đã đọc
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          </>
        )}

        {/* Health Check Modal */}
        {showHealthCheckModal && (
          <div className="modal-overlay" onClick={() => setShowHealthCheckModal(false)}>
            <div className="modern-modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Modal Close Button */}
              <button 
                className="modal-close-btn"
                onClick={() => {
                  setShowHealthCheckModal(false);
                  setDenyReason('');
                  setDenyError('');
                }}
              >
                <i className="fas fa-times"></i>
              </button>

              {/* Modal Icon & Animation */}
              <div className="modal-icon-container">
                <div className="modal-icon health-check">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <div className="pulse-ring"></div>
              </div>

              {/* Modal Header */}
              <div className="modern-modal-header">
                <h2 className="modern-modal-title">Xác nhận khám sức khỏe</h2>
                <p className="modern-modal-subtitle">
                  Bạn có đồng ý cho con em tham gia chương trình khám sức khỏe định kỳ của nhà trường không?
                </p>
                <div className="modal-divider"></div>
              </div>

              {!denyError && (
                <div className="modern-modal-actions">
                  <button
                    className="modern-btn modern-btn-approve"
                    onClick={async () => {
                      await handleApproveHealthCheck(selectedConsentFormId);
                      setShowHealthCheckModal(false);
                    }}
                  >
                    <div className="btn-content">
                      <i className="fas fa-check"></i>
                      <span>ĐỒNG Ý</span>
                    </div>
                    <div className="btn-shine"></div>
                  </button>
                  
                  <button
                    className="modern-btn modern-btn-reject"
                    onClick={() => setDenyError('show')}
                  >
                    <div className="btn-content">
                      <i className="fas fa-times"></i>
                      <span>TỪ CHỐI</span>
                    </div>
                    <div className="btn-shine"></div>
                  </button>
                  
                  <button
                    className="modern-btn modern-btn-neutral"
                    onClick={() => {
                      setShowHealthCheckModal(false);
                      setDenyReason('');
                      setDenyError('');
                    }}
                  >
                    <div className="btn-content">
                      <i className="fas fa-pause"></i>
                      <span>ĐÓNG</span>
                    </div>
                    <div className="btn-shine"></div>
                  </button>
                </div>
              )}

              {denyError === 'show' && (
                <div className="modern-modal-form">
                  <div className="form-header">
                    <i className="fas fa-edit"></i>
                    <h3>Lý do từ chối</h3>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Vui lòng cho biết lý do từ chối:</label>
                    <textarea
                      className="modern-reason-input"
                      placeholder="Nhập lý do từ chối chương trình khám sức khỏe..."
                      value={denyReason}
                      onChange={e => setDenyReason(e.target.value)}
                      rows={4}
                    />
                    {denyError && denyError !== 'show' && (
                      <div className="modern-error-message">
                        <i className="fas fa-exclamation-triangle"></i>
                        {denyError}
                      </div>
                    )}
                  </div>
                  
                  <div className="modern-modal-actions">
                    <button
                      className="modern-btn modern-btn-confirm-reject"
                      onClick={async () => {
                        if (!denyReason.trim()) {
                          setDenyError('Vui lòng nhập lý do từ chối!');
                          return;
                        }
                        await handleDenyHealthCheck(selectedConsentFormId, denyReason);
                        setShowHealthCheckModal(false);
                        setDenyReason('');
                        setDenyError('');
                      }}
                    >
                      <div className="btn-content">
                        <i className="fas fa-paper-plane"></i>
                        <span>XÁC NHẬN TỪ CHỐI</span>
                      </div>
                      <div className="btn-shine"></div>
                    </button>
                    
                    <button
                      className="modern-btn modern-btn-back"
                      onClick={() => {
                        setDenyError('');
                        setDenyReason('');
                      }}
                    >
                      <div className="btn-content">
                        <i className="fas fa-arrow-left"></i>
                        <span>QUAY LẠI</span>
                      </div>
                      <div className="btn-shine"></div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vaccination Modal */}
        {showVaccineModal && (
          <div className="modal-overlay" onClick={() => setShowVaccineModal(false)}>
            <div className="modern-modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Modal Close Button */}
              <button 
                className="modal-close-btn"
                onClick={() => {
                  setShowVaccineModal(false);
                  setVaccineDenyReason('');
                  setVaccineDenyError('');
                }}
              >
                <i className="fas fa-times"></i>
              </button>

              {/* Modal Icon & Animation */}
              <div className="modal-icon-container">
                <div className="modal-icon vaccination">
                  <i className="fas fa-syringe"></i>
                </div>
                <div className="pulse-ring"></div>
              </div>

              {/* Modal Header */}
              <div className="modern-modal-header">
                <h2 className="modern-modal-title">Xác nhận tiêm chủng</h2>
                <p className="modern-modal-subtitle">
                  Bạn có đồng ý cho con em tham gia chương trình tiêm chủng theo kế hoạch của nhà trường không?
                </p>
                <div className="modal-divider"></div>
              </div>

              {!vaccineDenyError && (
                <div className="modern-modal-actions">
                  <button
                    className="modern-btn modern-btn-approve"
                    onClick={async () => {
                      await handleApproveConsent(selectedVaccineConsentFormId);
                      setShowVaccineModal(false);
                    }}
                  >
                    <div className="btn-content">
                      <i className="fas fa-check"></i>
                      <span>ĐỒNG Ý</span>
                    </div>
                    <div className="btn-shine"></div>
                  </button>
                  
                  <button
                    className="modern-btn modern-btn-reject"
                    onClick={() => setVaccineDenyError('show')}
                  >
                    <div className="btn-content">
                      <i className="fas fa-times"></i>
                      <span>TỪ CHỐI</span>
                    </div>
                    <div className="btn-shine"></div>
                  </button>
                  
                  <button
                    className="modern-btn modern-btn-neutral"
                    onClick={() => {
                      setShowVaccineModal(false);
                      setVaccineDenyReason('');
                      setVaccineDenyError('');
                    }}
                  >
                    <div className="btn-content">
                      <i className="fas fa-pause"></i>
                      <span>ĐÓNG</span>
                    </div>
                    <div className="btn-shine"></div>
                  </button>
                </div>
              )}
              {vaccineDenyError === 'show' && (
                <div className="modern-modal-form">
                  <div className="form-header">
                    <i className="fas fa-edit"></i>
                    <h3>Lý do từ chối</h3>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Vui lòng cho biết lý do từ chối:</label>
                    <textarea
                      className="modern-reason-input"
                      placeholder="Nhập lý do từ chối chương trình tiêm chủng..."
                      value={vaccineDenyReason}
                      onChange={e => setVaccineDenyReason(e.target.value)}
                      rows={4}
                    />
                    {vaccineDenyError && vaccineDenyError !== 'show' && (
                      <div className="modern-error-message">
                        <i className="fas fa-exclamation-triangle"></i>
                        {vaccineDenyError}
                      </div>
                    )}
                  </div>
                  
                  <div className="modern-modal-actions">
                    <button
                      className="modern-btn modern-btn-confirm-reject"
                      onClick={async () => {
                        if (!vaccineDenyReason.trim()) {
                          setVaccineDenyError('Vui lòng nhập lý do từ chối!');
                          return;
                        }
                        await handleDenyConsent(selectedVaccineConsentFormId, vaccineDenyReason);
                        setShowVaccineModal(false);
                        setVaccineDenyReason('');
                        setVaccineDenyError('');
                      }}
                    >
                      <div className="btn-content">
                        <i className="fas fa-paper-plane"></i>
                        <span>XÁC NHẬN TỪ CHỐI</span>
                      </div>
                      <div className="btn-shine"></div>
                    </button>
                    
                    <button
                      className="modern-btn modern-btn-back"
                      onClick={() => {
                        setVaccineDenyError('');
                        setVaccineDenyReason('');
                      }}
                    >
                      <div className="btn-content">
                        <i className="fas fa-arrow-left"></i>
                        <span>QUAY LẠI</span>
                      </div>
                      <div className="btn-shine"></div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 