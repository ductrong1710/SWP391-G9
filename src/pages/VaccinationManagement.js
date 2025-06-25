import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import './VaccinationManagement.css';

const VaccinationManagement = () => {
  const navigate = useNavigate();
  const { getUserRole } = useAuth();
  const [vaccinationPlans, setVaccinationPlans] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [formData, setFormData] = useState({
    vaccineName: '',
    description: '',
    scheduledDate: '',
    targetClass: '',
    targetGrade: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userRole = getUserRole();
      if (userRole !== 'MedicalStaff') {
        navigate('/dashboard');
        return;
      }
      const [plansResponse, studentsResponse] = await Promise.all([
        apiClient.get('/VaccinationPlan'),
        apiClient.get('/User/students')
      ]);
      setVaccinationPlans(plansResponse.data);
      setStudents(studentsResponse.data);
    } catch (error) {
      setVaccinationPlans(getMockVaccinationPlans());
      setStudents(getMockStudents());
    } finally {
      setLoading(false);
    }
  };

  const getMockVaccinationPlans = () => {
    return [
      {
        id: 'VP0001',
        vaccineName: 'Vắc-xin Viêm gan B',
        description: 'Tiêm cho học sinh lớp 6',
        scheduledDate: '2025-06-25',
        targetClass: '6A, 6B',
        targetGrade: '6',
        status: 'Pending',
        totalStudents: 2,
        confirmedCount: 1,
        pendingCount: 1,
        completedCount: 1,
        notes: 'Chiến dịch tiêm vắc-xin Viêm gan B',
        createdDate: '2025-06-01',
        createdBy: 'Trần Thị B'
      },
      {
        id: 'VP0002',
        vaccineName: 'Vắc-xin Sởi - Quai bị - Rubella',
        description: 'Tiêm cho học sinh lớp 7',
        scheduledDate: '2025-07-10',
        targetClass: '',
        targetGrade: '7',
        status: 'Completed',
        totalStudents: 0,
        confirmedCount: 0,
        pendingCount: 0,
        completedCount: 0,
        notes: 'Chiến dịch tiêm vắc-xin Sởi - Quai bị - Rubella',
        createdDate: '2025-07-01',
        createdBy: 'Lê Văn C'
      }
    ];
  };

  const getMockStudents = () => {
    return [
      { id: 'U00007', fullName: 'Học Sinh G', className: '6A', grade: '6' },
      { id: 'U00008', fullName: 'Học Sinh H', className: '6B', grade: '6' }
    ];
  };

  const filteredPlans = vaccinationPlans.filter(plan => {
    const matchesSearch = plan.vaccineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return '#3182ce';
      case 'Completed':
        return '#38a169';
      case 'Cancelled':
        return '#e53e3e';
      case 'Pending':
        return '#d69e2e';
      default:
        return '#718096';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Active':
        return 'Đang thực hiện';
      case 'Completed':
        return 'Hoàn thành';
      case 'Cancelled':
        return 'Đã hủy';
      case 'Pending':
        return 'Chờ thực hiện';
      default:
        return status;
    }
  };

  const handleCreatePlan = () => {
    setFormData({
      vaccineName: '',
      description: '',
      scheduledDate: '',
      targetClass: '',
      targetGrade: '',
      notes: ''
    });
    setShowCreateModal(true);
  };

  const handleViewDetails = (plan) => {
    setSelectedPlan(plan);
    setShowDetailsModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newPlan = {
        ...formData,
        status: 'Active',
        totalStudents: 0,
        confirmedCount: 0,
        pendingCount: 0,
        completedCount: 0,
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: 'BS. Medical Staff'
      };

      const response = await apiClient.post('/VaccinationPlan', newPlan);
      setVaccinationPlans([...vaccinationPlans, response.data]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating vaccination plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotifications = async (planId) => {
    try {
      setLoading(true);
      await apiClient.post(`/VaccinationPlan/${planId}/send-notifications`);
      // Update plan status or show success message
    } catch (error) {
      console.error('Error sending notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && vaccinationPlans.length === 0) {
    return (
      <div className="vaccination-management-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="vaccination-management-container">
      <div className="vaccination-header">
        <h1>Quản lý tiêm chủng</h1>
        <p>Lên kế hoạch và quản lý tiêm chủng cho học sinh</p>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên vaccine hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Active">Đang thực hiện</option>
            <option value="Completed">Hoàn thành</option>
            <option value="Cancelled">Đã hủy</option>
            <option value="Pending">Chờ thực hiện</option>
          </select>
        </div>

        <button 
          className="create-plan-btn"
          onClick={handleCreatePlan}
        >
          <i className="fas fa-plus"></i>
          Tạo kế hoạch mới
        </button>
      </div>

      {/* Vaccination Plans List */}
      <div className="vaccination-plans-list">
        {filteredPlans.map((plan) => (
          <div key={plan.id} className="vaccination-plan-card">
            <div className="plan-header">
              <div className="plan-title">
                <h3>{plan.vaccineName}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(plan.status) }}
                >
                  {getStatusText(plan.status)}
                </span>
              </div>
              <div className="plan-date">
                <i className="fas fa-calendar"></i>
                {new Date(plan.scheduledDate).toLocaleDateString('vi-VN')}
              </div>
            </div>

            <div className="plan-content">
              <div className="plan-description">
                <h4>Mô tả</h4>
                <p>{plan.description}</p>
              </div>

              <div className="plan-target">
                <h4>Đối tượng</h4>
                <p><strong>Khối:</strong> {plan.targetGrade}</p>
                <p><strong>Lớp:</strong> {plan.targetClass}</p>
              </div>

              <div className="plan-stats">
                <h4>Thống kê</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Tổng học sinh:</span>
                    <span className="stat-value">{plan.totalStudents}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Đã xác nhận:</span>
                    <span className="stat-value confirmed">{plan.confirmedCount}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Chờ phản hồi:</span>
                    <span className="stat-value pending">{plan.pendingCount}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Đã tiêm:</span>
                    <span className="stat-value completed">{plan.completedCount}</span>
                  </div>
                </div>
              </div>

              <div className="plan-actions">
                <button 
                  className="view-details-btn"
                  onClick={() => handleViewDetails(plan)}
                >
                  <i className="fas fa-eye"></i>
                  Xem chi tiết
                </button>
                
                {plan.status === 'Active' && plan.pendingCount > 0 && (
                  <button 
                    className="send-notifications-btn"
                    onClick={() => handleSendNotifications(plan.id)}
                  >
                    <i className="fas fa-bell"></i>
                    Gửi thông báo
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredPlans.length === 0 && (
          <div className="no-results">
            <i className="fas fa-syringe"></i>
            <p>Không tìm thấy kế hoạch tiêm chủng nào</p>
          </div>
        )}
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="create-plan-modal">
            <div className="modal-header">
              <h3>Tạo kế hoạch tiêm chủng mới</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tên vaccine:</label>
                  <input
                    type="text"
                    name="vaccineName"
                    value={formData.vaccineName}
                    onChange={handleInputChange}
                    placeholder="Nhập tên vaccine..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mô tả:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Mô tả chi tiết về vaccine và mục đích tiêm chủng..."
                    rows="3"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày dự kiến:</label>
                    <input
                      type="date"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Khối:</label>
                    <select
                      name="targetGrade"
                      value={formData.targetGrade}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn khối</option>
                      <option value="6">Khối 6</option>
                      <option value="7">Khối 7</option>
                      <option value="8">Khối 8</option>
                      <option value="9">Khối 9</option>
                      <option value="10">Khối 10</option>
                      <option value="11">Khối 11</option>
                      <option value="12">Khối 12</option>
                      <option value="Tất cả">Tất cả</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Lớp cụ thể (tùy chọn):</label>
                  <input
                    type="text"
                    name="targetClass"
                    value={formData.targetClass}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 10A1, 10A2, 11A1..."
                  />
                </div>

                <div className="form-group">
                  <label>Ghi chú:</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Ghi chú bổ sung..."
                    rows="2"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Đang tạo...' : 'Tạo kế hoạch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedPlan && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết kế hoạch - {selectedPlan.vaccineName}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Thông tin cơ bản</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Tên vaccine:</label>
                    <span>{selectedPlan.vaccineName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày dự kiến:</label>
                    <span>{new Date(selectedPlan.scheduledDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="detail-item">
                    <label>Trạng thái:</label>
                    <span>{getStatusText(selectedPlan.status)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Người tạo:</label>
                    <span>{selectedPlan.createdBy}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày tạo:</label>
                    <span>{new Date(selectedPlan.createdDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Mô tả</h4>
                <p>{selectedPlan.description}</p>
              </div>

              <div className="detail-section">
                <h4>Đối tượng</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Khối:</label>
                    <span>{selectedPlan.targetGrade}</span>
                  </div>
                  <div className="detail-item">
                    <label>Lớp:</label>
                    <span>{selectedPlan.targetClass}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Thống kê chi tiết</h4>
                <div className="stats-detail">
                  <div className="stat-card">
                    <div className="stat-number">{selectedPlan.totalStudents}</div>
                    <div className="stat-label">Tổng học sinh</div>
                  </div>
                  <div className="stat-card confirmed">
                    <div className="stat-number">{selectedPlan.confirmedCount}</div>
                    <div className="stat-label">Đã xác nhận</div>
                  </div>
                  <div className="stat-card pending">
                    <div className="stat-number">{selectedPlan.pendingCount}</div>
                    <div className="stat-label">Chờ phản hồi</div>
                  </div>
                  <div className="stat-card completed">
                    <div className="stat-number">{selectedPlan.completedCount}</div>
                    <div className="stat-label">Đã tiêm</div>
                  </div>
                </div>
              </div>

              {selectedPlan.notes && (
                <div className="detail-section">
                  <h4>Ghi chú</h4>
                  <p>{selectedPlan.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationManagement;
