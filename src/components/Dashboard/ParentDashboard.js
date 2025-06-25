import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    childrenCount: 2,
    healthRecords: 2,
    pendingNotifications: 3,
    medicalHistory: 15,
    medicationSubmissions: 5
  });

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-layout">
      <div className="main-container">
        <main className="main-content">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">
                Chào mừng đến với HealthConnect - Phụ huynh
              </h1>
              <p className="hero-subtitle">
                Quản lý sức khỏe con em bạn một cách dễ dàng và hiệu quả
              </p>
              
              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="hero-stat-value">{stats.childrenCount}</div>
                  <div className="hero-stat-label">Con em đang theo dõi</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">{stats.healthRecords}</div>
                  <div className="hero-stat-label">Hồ sơ sức khỏe</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">{stats.pendingNotifications}</div>
                  <div className="hero-stat-label">Thông báo chờ xử lý</div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="quick-actions">
            <h2 className="section-title">Chức năng chính</h2>
            
            <div className="actions-grid">
              <div className="action-card" onClick={() => handleNavigate('/health-declaration')}>
                <div className="action-icon">
                  <i className="fas fa-file-medical"></i>
                </div>
                <div className="action-title">Khai báo hồ sơ sức khỏe</div>
                <div className="action-description">
                  Khai báo và cập nhật thông tin sức khỏe của con em bạn cho nhà trường.
                </div>
              </div>

              <div className="action-card" onClick={() => handleNavigate('/send-medicine')}>
                <div className="action-icon">
                  <i className="fas fa-pills"></i>
                </div>
                <div className="action-title">Gửi thuốc</div>
                <div className="action-description">
                  Gửi thuốc cần thiết cho con em bạn tại trường học một cách an toàn.
                </div>
              </div>

              <div className="action-card" onClick={() => handleNavigate('/notifications')}>
                <div className="action-icon">
                  <i className="fas fa-bell"></i>
                </div>
                <div className="action-title">Thông báo xác nhận</div>
                <div className="action-description">
                  Nhận và phản hồi thông báo xác nhận tiêm chủng từ nhân viên y tế.
                </div>
              </div>

              <div className="action-card" onClick={() => handleNavigate('/medical-history')}>
                <div className="action-icon">
                  <i className="fas fa-history"></i>
                </div>
                <div className="action-title">Lịch sử kiểm tra y tế</div>
                <div className="action-description">
                  Xem lịch sử các lần kiểm tra sức khỏe và kết quả của con em bạn.
                </div>
              </div>

              <div className="action-card" onClick={() => handleNavigate('/blog-documents')}>
                <div className="action-icon">
                  <i className="fas fa-book-medical"></i>
                </div>
                <div className="action-title">Blog & Tài liệu</div>
                <div className="action-description">
                  Đọc các bài viết và tài liệu về sức khỏe từ nhân viên y tế nhà trường.
                </div>
              </div>

              <div className="action-card" onClick={() => handleNavigate('/profile-management')}>
                <div className="action-icon">
                  <i className="fas fa-user-edit"></i>
                </div>
                <div className="action-title">Quản lý hồ sơ</div>
                <div className="action-description">
                  Cập nhật thông tin cá nhân và quản lý hồ sơ gia đình.
                </div>
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="stats-section">
            <h2 className="section-title">Thống kê tổng quan</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-child"></i>
                </div>
                <div className="stat-value">{stats.childrenCount}</div>
                <div className="stat-label">Con em đang theo dõi</div>
                <div className="stat-change stat-increase">Cập nhật mới nhất</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-file-medical-alt"></i>
                </div>
                <div className="stat-value">{stats.healthRecords}</div>
                <div className="stat-label">Hồ sơ sức khỏe</div>
                <div className="stat-change stat-increase">Đã cập nhật gần đây</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-bell"></i>
                </div>
                <div className="stat-value">{stats.pendingNotifications}</div>
                <div className="stat-label">Thông báo chờ xử lý</div>
                <div className="stat-change stat-decrease">Cần phản hồi</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-pills"></i>
                </div>
                <div className="stat-value">{stats.medicationSubmissions}</div>
                <div className="stat-label">Lần gửi thuốc</div>
                <div className="stat-change stat-increase">+1 trong tuần này</div>
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="activity-section">
            <h2 className="section-title">Hoạt động gần đây</h2>
            
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-file-medical"></i>
                </div>
                <div className="activity-content">
                  <div className="activity-text">Cập nhật hồ sơ sức khỏe cho con trai</div>
                  <div className="activity-time">1 ngày trước</div>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-bell"></i>
                </div>
                <div className="activity-content">
                  <div className="activity-text">Nhận thông báo xác nhận tiêm chủng</div>
                  <div className="activity-time">2 ngày trước</div>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-pills"></i>
                </div>
                <div className="activity-content">
                  <div className="activity-text">Gửi thuốc cho con gái</div>
                  <div className="activity-time">3 ngày trước</div>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-history"></i>
                </div>
                <div className="activity-content">
                  <div className="activity-text">Xem kết quả kiểm tra sức khỏe định kỳ</div>
                  <div className="activity-time">1 tuần trước</div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ParentDashboard; 