import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  // Kiểm tra xác thực trực tiếp trong component
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("Dashboard: Not authenticated, redirecting to login");
      navigate('/login', { 
        state: { 
          from: { pathname: '/dashboard' },
          manualLogin: true 
        } 
      });
    }
  }, [isAuthenticated, loading, navigate]);
  
  // Nếu đang loading hoặc chưa đăng nhập, hiển thị thông báo loading
  if (loading || !isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '50px 0' }}>
        <div className="loading-spinner">Đang kiểm tra thông tin đăng nhập...</div>
      </div>
    );
  }
  
  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero-overlay"></div>
        <div className="dashboard-hero-content">
          <h1 className="dashboard-hero-title">Tổng quan y tế</h1>
          <p className="dashboard-hero-desc">
            Quản lý thông tin sức khỏe cá nhân và theo dõi các hoạt động y tế của bạn
          </p>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-container">
          <h2 className="section-title">Thông tin sức khỏe hiện tại</h2>
          
          <div className="dashboard-grid">
            <div className="service-card health-status">
              <div className="service-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <h3>Tình trạng sức khỏe</h3>
              <div className="status-indicator good">Tốt</div>
              <p>Cập nhật lần cuối: 19/06/2025</p>
            </div>
              <div className="service-card upcoming">
              <div className="service-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3>Khám sức khỏe định kỳ</h3>              <div className="health-check-info">
                <div className="next-appointment">
                  <span className="info-label">Lịch khám sắp tới:</span>
                  <span className="info-value">22/06/2025</span>
                </div>
                <div className="checkup-details">
                  <span className="info-label">Địa điểm:</span>
                  <span className="info-value">Phòng Y tế - Tòa nhà B</span>
                </div>
                <div className="checkup-doctor">
                  <span className="info-label">Bác sĩ phụ trách:</span>
                  <span className="info-value">BS. Nguyễn Văn A</span>
                </div>
                <div className="checkup-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: "75%"}}></div>
                  </div>
                  <div className="progress-text">3/4 lần khám trong năm</div>
                </div>
              </div>
            </div>
            
            <div className="service-card vaccinations">
              <div className="service-icon">
                <i className="fas fa-syringe"></i>
              </div>
              <h3>Tiêm chủng</h3>
              <div className="vac-status">
                <span className="vac-complete">6</span>
                <span className="vac-total">/ 8</span> mũi tiêm hoàn thành
              </div>
              <div className="vac-next">Mũi tiếp theo: 15/07/2025</div>
            </div>
            
            <div className="service-card medications">
              <div className="service-icon">
                <i className="fas fa-pills"></i>
              </div>
              <h3>Thuốc đang dùng</h3>
              <ul className="med-list">
                <li>Vitamin C (1 viên/ngày)</li>
                <li>Paracetamol (khi cần)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="dashboard-section">
        <div className="dashboard-container">
          <h2 className="section-title">Tóm tắt sức khỏe</h2>
          
          <div className="health-summary-container">
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-icon">
                  <i className="fas fa-ruler-vertical"></i>
                </div>
                <div className="summary-label">Chiều cao</div>
                <div className="summary-value">168 cm</div>
              </div>
              <div className="summary-item">
                <div className="summary-icon">
                  <i className="fas fa-weight"></i>
                </div>
                <div className="summary-label">Cân nặng</div>
                <div className="summary-value">60 kg</div>
              </div>
              <div className="summary-item">
                <div className="summary-icon">
                  <i className="fas fa-calculator"></i>
                </div>
                <div className="summary-label">BMI</div>
                <div className="summary-value">21.3</div>
              </div>
              <div className="summary-item">
                <div className="summary-icon">
                  <i className="fas fa-tint"></i>
                </div>
                <div className="summary-label">Nhóm máu</div>
                <div className="summary-value">O+</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="dashboard-section">
        <div className="dashboard-container">
          <h2 className="section-title">Hoạt động gần đây</h2>
          
          <div className="recent-activities-container">
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-date">15/06/2025</div>
                <div className="activity-desc">Cập nhật khai báo y tế</div>
              </div>
              <div className="activity-item">
                <div className="activity-date">10/06/2025</div>
                <div className="activity-desc">Hoàn thành khám sức khỏe định kỳ</div>
              </div>
              <div className="activity-item">
                <div className="activity-date">05/06/2025</div>
                <div className="activity-desc">Nhận thuốc Vitamin C</div>
              </div>
            </div>
          </div>
        </div>
      </section>
        <section className="dashboard-section">
        <div className="dashboard-container">
          <h2 className="section-title">Lịch sử khám sức khỏe định kỳ</h2>
          
          <div className="health-checkup-history">
            <div className="history-timeline">
              <div className="timeline-item completed">
                <div className="timeline-date">
                  <span className="date-day">10</span>
                  <span className="date-month">Tháng 3</span>
                </div>
                <div className="timeline-content">
                  <h4>Khám sức khỏe Quý I</h4>
                  <div className="timeline-details">
                    <p><strong>Bác sĩ:</strong> BS. Lê Thị B</p>
                    <p><strong>Kết quả:</strong> <span className="status good">Tốt</span></p>
                    <p><strong>Ghi chú:</strong> Sức khỏe ổn định, cần bổ sung vitamin D</p>
                  </div>
                  <button className="btn-view-details">Xem chi tiết</button>
                </div>
              </div>
              
              <div className="timeline-item completed">
                <div className="timeline-date">
                  <span className="date-day">15</span>
                  <span className="date-month">Tháng 6</span>
                </div>
                <div className="timeline-content">
                  <h4>Khám sức khỏe Quý II</h4>
                  <div className="timeline-details">
                    <p><strong>Bác sĩ:</strong> BS. Nguyễn Văn A</p>
                    <p><strong>Kết quả:</strong> <span className="status good">Tốt</span></p>
                    <p><strong>Ghi chú:</strong> Sức khỏe ổn định</p>
                  </div>
                  <button className="btn-view-details">Xem chi tiết</button>
                </div>
              </div>
              
              <div className="timeline-item upcoming">
                <div className="timeline-date">
                  <span className="date-day">22</span>
                  <span className="date-month">Tháng 6</span>
                </div>
                <div className="timeline-content">
                  <h4>Khám sức khỏe bổ sung</h4>
                  <div className="timeline-details">
                    <p><strong>Bác sĩ:</strong> BS. Nguyễn Văn A</p>
                    <p><strong>Địa điểm:</strong> Phòng Y tế - Tòa nhà B</p>
                    <p><strong>Thời gian:</strong> 9:00 - 11:00</p>
                  </div>
                  <button className="btn-reschedule">Đổi lịch hẹn</button>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-date">
                  <span className="date-day">10</span>
                  <span className="date-month">Tháng 9</span>
                </div>
                <div className="timeline-content">
                  <h4>Khám sức khỏe Quý III</h4>
                  <div className="timeline-details">
                    <p><strong>Bác sĩ:</strong> BS. Trần C</p>
                    <p><strong>Địa điểm:</strong> Phòng Y tế - Tòa nhà B</p>
                    <p><strong>Thời gian:</strong> 14:00 - 16:00</p>
                  </div>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-date">
                  <span className="date-day">12</span>
                  <span className="date-month">Tháng 12</span>
                </div>
                <div className="timeline-content">
                  <h4>Khám sức khỏe Quý IV</h4>
                  <div className="timeline-details">
                    <p><strong>Chưa có lịch hẹn</strong></p>
                  </div>
                  <button className="btn-schedule">Đặt lịch hẹn</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="dashboard-section">
        <div className="dashboard-container">
          <h2 className="section-title">Kết quả khám sức khỏe</h2>
          
          <div className="health-check-results">
            <div className="result-card">
              <div className="result-header">
                <h3>Khám sức khỏe định kỳ - Quý II</h3>
                <div className="result-date">15/06/2025</div>
              </div>
              <div className="result-content">
                <div className="result-item">
                  <span className="item-label">Tình trạng sức khỏe:</span>
                  <span className="item-value good">Tốt</span>
                </div>
                <div className="result-item">
                  <span className="item-label">Nhịp tim:</span>
                  <span className="item-value">72 bpm</span>
                </div>
                <div className="result-item">
                  <span className="item-label">Huyết áp:</span>
                  <span className="item-value">120/80 mmHg</span>
                </div>
                <div className="result-item">
                  <span className="item-label">Cholesterol:</span>
                  <span className="item-value">180 mg/dL</span>
                </div>
                <div className="result-item">
                  <span className="item-label">Glucose:</span>
                  <span className="item-value">90 mg/dL</span>
                </div>
              </div>
              <div className="result-footer">
                <button className="btn-download-report">Tải báo cáo</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;