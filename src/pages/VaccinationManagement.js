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
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    PlanName: '',
    ScheduledDate: '',
    Description: '',
    Status: 'Active',
    Grade: 'Toàn trường',
  });
  const [editFormData, setEditFormData] = useState({
    id: '',
    PlanName: '',
    ScheduledDate: '',
    Description: '',
    Status: '',
    Grade: 'Toàn trường',
  });
  const [vaccineList, setVaccineList] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [planToNotify, setPlanToNotify] = useState(null);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState('');
  const gradeOptions = ['Toàn trường', '6', '7', '8', '9'];

  useEffect(() => {
    fetchData();
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    if (showCreateModal) {
      apiClient.get('/VaccineType').then(res => {
        setVaccineList(res.data);
      });
    }
  }, [showCreateModal]);

  useEffect(() => {
    if (showEditModal && vaccineList.length === 0) {
      apiClient.get('/VaccineType').then(res => {
        setVaccineList(res.data);
      });
    }
  }, [showEditModal]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userRole = getUserRole();
      if (userRole !== 'MedicalStaff') {
        navigate('/dashboard');
        return;
      }
      // Fetch kế hoạch tiêm chủng
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const plansResponse = await apiClient.get(`/VaccinationPlan?${params.toString()}`);
      setVaccinationPlans(plansResponse.data);

      // Fetch students (nếu cần)
      // Giữ lại nếu bạn có logic khác cần danh sách toàn bộ học sinh
      // Nếu không, có thể xóa.
      // const studentsResponse = await apiClient.get('/User/students');
      // setStudents(studentsResponse.data);
    } catch (err) {
      console.error('Lỗi lấy dữ liệu tiêm chủng:', err);
      // Fallback to empty array on error
      setVaccinationPlans([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const CreatorID = user?.userID || user?.UserID || '';
      if (!formData.PlanName || !CreatorID) {
        alert('Vui lòng nhập đầy đủ tên kế hoạch và đảm bảo bạn đã đăng nhập!');
        setLoading(false);
        return;
      }
      const newPlan = {
        PlanName: formData.PlanName.trim(),
        ScheduledDate: formData.ScheduledDate ? new Date(formData.ScheduledDate).toISOString() : null,
        Description: formData.Description,
        Status: formData.Status,
        CreatorID,
        Grade: formData.Grade,
      };
      console.log('Payload gửi lên:', newPlan);
      await apiClient.post('/VaccinationPlan', newPlan);
      setShowCreateModal(false);
      fetchData();
    } catch (error) {
      alert('Có lỗi khi tạo kế hoạch tiêm chủng!');
      console.error('Error creating vaccination plan:', error?.response?.data || error);
    } finally {
      setLoading(false);
    }
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

  const handleOpenNotifyModal = (plan) => {
    setPlanToNotify(plan);
    setShowConfirmModal(true);
    setNotifyMessage('');
  };

  const handleSendNotificationsConfirmed = async () => {
    if (!planToNotify) return;
    setNotifyLoading(true);
    setNotifyMessage('');
    try {
      await apiClient.post(`/VaccinationPlan/${planToNotify.id}/send-notifications`);
      setNotifyMessage('Gửi thông báo thành công!');
      setTimeout(() => {
        setShowConfirmModal(false);
        setPlanToNotify(null);
        setNotifyMessage('');
      }, 1200);
    } catch (error) {
      setNotifyMessage('Gửi thông báo thất bại!');
    } finally {
      setNotifyLoading(false);
    }
  };

  const normalize = str => (str || '').toLowerCase().replace(/\s+/g, ' ').trim();

  const handleEditPlan = (plan) => {
    console.log('plan object:', plan);
    const setEditData = (vaccineListData) => {
      console.log('plan.planName:', plan.PlanName);
      console.log('vaccineList:', vaccineListData.map(v => v.vaccineName || v.VaccineName));
      let matchedVaccine = '';
      if (vaccineListData.length > 0) {
        const found = vaccineListData.find(
          v => normalize(v.vaccineName || v.VaccineName) === normalize(plan.PlanName)
        );
        matchedVaccine = found ? (found.vaccineName || found.VaccineName) : plan.PlanName;
      } else {
        matchedVaccine = plan.PlanName;
      }
      setEditFormData({
        id: plan.id,
        PlanName: matchedVaccine,
        ScheduledDate: plan.scheduledDate ? plan.scheduledDate.slice(0, 10) : '',
        Description: plan.description,
        Status: plan.status,
        Grade: plan.grade || 'Toàn trường',
      });
      setShowEditModal(true);
    };

    if (vaccineList.length === 0) {
      apiClient.get('/VaccineType').then(res => {
        setVaccineList(res.data);
        setEditData(res.data);
      });
    } else {
      setEditData(vaccineList);
    }
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Lấy CreatorID từ selectedPlan, nếu không có thì lấy từ user đăng nhập
      let CreatorID = selectedPlan?.creatorID || selectedPlan?.CreatorID || '';
      if (!CreatorID) {
        const user = JSON.parse(localStorage.getItem('user'));
        CreatorID = user?.userID || user?.UserID || '';
      }
      if (Array.isArray(CreatorID)) {
        CreatorID = CreatorID[0] || '';
      }
      console.log('CreatorID gửi lên:', CreatorID);
      await apiClient.put(`/VaccinationPlan/${editFormData.id}`, {
        PlanName: editFormData.PlanName,
        ScheduledDate: editFormData.ScheduledDate ? new Date(editFormData.ScheduledDate).toISOString() : null,
        Description: editFormData.Description,
        Status: editFormData.Status,
        ID: editFormData.id,
        CreatorID,
        Grade: editFormData.Grade,
      });
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      alert('Có lỗi khi cập nhật kế hoạch!');
      console.error('Error updating plan:', error?.response?.data || error);
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

  const totalStudents = selectedPlan?.ConsentForms?.length || 0;
  const confirmedCount = selectedPlan?.ConsentForms?.filter(f => f.ConsentStatus === "Approved").length || 0;
  const pendingCount = selectedPlan?.ConsentForms?.filter(f => !f.ConsentStatus).length || 0;
  const completedCount = selectedPlan?.ConsentForms?.filter(f => f.VaccinationResult != null).length || 0;

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
            value={searchTerm ?? ""}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filterStatus ?? ""}
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
          onClick={() => setShowCreateModal(true)}
        >
          <i className="fas fa-plus"></i>
          Tạo kế hoạch mới
        </button>
      </div>

      {/* Vaccination Plans List */}
      <div className="vaccination-plans-list">
        {vaccinationPlans.map((plan) => (
          <div key={plan.id} className="vaccination-plan-card">
            <div className="plan-header">
              <div className="plan-title">
                <h3>{plan.PlanName}</h3>
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
                <p><strong>Khối:</strong> {plan.grade || 'Toàn trường'}</p>
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
                <button
                  className="edit-btn"
                  onClick={() => handleEditPlan(plan)}
                >
                  <i className="fas fa-edit"></i>
                  Chỉnh sửa
                </button>
                <button
                  className="send-notifications-btn"
                  onClick={() => handleOpenNotifyModal(plan)}
                  disabled={notifyLoading}
                >
                  <i className="fas fa-bell"></i>
                  Gửi thông báo
                </button>
              </div>
            </div>
          </div>
        ))}

        {vaccinationPlans.length === 0 && (
          <div className="no-results">
            <i className="fas fa-syringe"></i>
            <p>Không tìm thấy kế hoạch tiêm chủng nào</p>
          </div>
        )}
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="create-plan-modal" style={{ background: '#f4f8fb' }}>
            <div className="modal-header">
              <h3>Tạo kế hoạch tiêm chủng mới</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreatePlan}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tên kế hoạch (Tên vaccine):</label>
                  <select
                    name="PlanName"
                    value={formData.PlanName ?? ""}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn vaccine...</option>
                    {vaccineList.map(v => (
                      <option key={v.id} value={v.vaccineName || v.VaccineName}>{v.vaccineName || v.VaccineName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Ngày dự kiến:</label>
                  <input
                    type="date"
                    name="ScheduledDate"
                    value={formData.ScheduledDate ?? ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả:</label>
                  <textarea
                    name="Description"
                    value={formData.Description ?? ""}
                    onChange={handleInputChange}
                    placeholder="Mô tả chi tiết về kế hoạch tiêm chủng..."
                    rows="3"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Trạng thái:</label>
                  <select
                    name="Status"
                    value={formData.Status ?? ""}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Active">Đang thực hiện</option>
                    <option value="Pending">Chờ thực hiện</option>
                    <option value="Completed">Hoàn thành</option>
                    <option value="Cancelled">Đã hủy</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Khối:</label>
                  <select
                    name="Grade"
                    value={formData.Grade}
                    onChange={handleInputChange}
                    required
                  >
                    {gradeOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
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
          <div className="vaccination-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <i className="fas fa-syringe"></i> Chi tiết kế hoạch tiêm chủng
              </h3>
              <button 
                className="close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="vaccination-status-badge" data-status={selectedPlan.status}>
                {getStatusText(selectedPlan.status)}
              </div>
              
              <div className="vaccination-title-section">
                <h2>{selectedPlan.PlanName}</h2>
                <p className="scheduled-date">
                  <i className="far fa-calendar-alt"></i>
                  {new Date(selectedPlan.scheduledDate).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="detail-section">
                <h4><i className="fas fa-info-circle"></i> Thông tin cơ bản</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Tên vaccine:</label>
                    <span className="highlight-value">{selectedPlan.PlanName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Người tạo:</label>
                    <span>{selectedPlan?.Creator?.Username || "Không rõ"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày tạo:</label>
                    <span>{new Date(selectedPlan.createdDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4><i className="fas fa-align-left"></i> Mô tả</h4>
                <div className="description-box">
                  <p>{selectedPlan.description || "Không có mô tả"}</p>
                </div>
              </div>

              <div className="detail-section">
                <h4><i className="fas fa-users"></i> Đối tượng tiêm chủng</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Khối:</label>
                    <span className="highlight-value">{selectedPlan.grade || 'Toàn trường'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Lớp:</label>
                    <span className="highlight-value">{selectedPlan.targetClass || "Tất cả"}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4><i className="fas fa-chart-pie"></i> Thống kê tiêm chủng</h4>
                <div className="vaccination-stats">
                  <div className="stat-card total">
                    <div className="stat-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">{totalStudents}</div>
                      <div className="stat-label">Tổng học sinh</div>
                    </div>
                  </div>
                  
                  <div className="stat-card confirmed">
                    <div className="stat-icon">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">{confirmedCount}</div>
                      <div className="stat-label">Đã xác nhận</div>
                    </div>
                  </div>
                  
                  <div className="stat-card pending">
                    <div className="stat-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">{pendingCount}</div>
                      <div className="stat-label">Chờ phản hồi</div>
                    </div>
                  </div>
                  
                  <div className="stat-card completed">
                    <div className="stat-icon">
                      <i className="fas fa-syringe"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">{completedCount}</div>
                      <div className="stat-label">Đã tiêm</div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedPlan.notes && (
                <div className="detail-section">
                  <h4><i className="fas fa-sticky-note"></i> Ghi chú</h4>
                  <div className="notes-box">
                    <p>{selectedPlan.notes}</p>
                  </div>
                </div>
              )}
              
              <div className="detail-actions">
                <button className="action-btn view-students" onClick={() => {
                  const confirmedStudents = selectedPlan?.ConsentForms?.filter(f => f.ConsentStatus === "Approved").map(f => f.Student);
                  navigate(`/vaccination-plan/${selectedPlan.id}/students`, { state: { students: confirmedStudents } });
                }}>
                  <i className="fas fa-users"></i> Xem danh sách học sinh
                </button>
                <button className="action-btn record-results" onClick={() => {
                  const confirmedStudents = selectedPlan?.ConsentForms?.filter(f => f.ConsentStatus === "Approved").map(f => f.Student);
                  navigate(`/vaccination-plan/${selectedPlan.id}/record`, { state: { students: confirmedStudents } });
                }}>
                  <i className="fas fa-clipboard-check"></i> Ghi nhận kết quả
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-plan-modal" style={{ background: '#f4f8fb', width: '540px', maxWidth: '95%' }}>
            <div className="modal-header">
              <h3>Chỉnh sửa kế hoạch tiêm chủng</h3>
              <button
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleUpdatePlan}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tên kế hoạch (Tên vaccine):</label>
                  <select
                    name="PlanName"
                    value={editFormData.PlanName ?? ""}
                    onChange={e => setEditFormData({ ...editFormData, PlanName: e.target.value })}
                    required
                  >
                    <option value="">Chọn vaccine...</option>
                    {vaccineList.map(v => (
                      <option key={v.id} value={v.vaccineName || v.VaccineName}>{v.vaccineName || v.VaccineName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Ngày dự kiến:</label>
                  <input
                    type="date"
                    name="ScheduledDate"
                    value={editFormData.ScheduledDate ?? ""}
                    onChange={e => setEditFormData({ ...editFormData, ScheduledDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả:</label>
                  <textarea
                    name="Description"
                    value={editFormData.Description ?? ""}
                    onChange={e => setEditFormData({ ...editFormData, Description: e.target.value })}
                    rows="3"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Trạng thái:</label>
                  <select
                    name="Status"
                    value={editFormData.Status ?? ""}
                    onChange={e => setEditFormData({ ...editFormData, Status: e.target.value })}
                    required
                  >
                    <option value="Active">Đang thực hiện</option>
                    <option value="Pending">Chờ thực hiện</option>
                    <option value="Completed">Hoàn thành</option>
                    <option value="Cancelled">Đã hủy</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Khối:</label>
                  <select
                    name="Grade"
                    value={editFormData.Grade}
                    onChange={e => setEditFormData({ ...editFormData, Grade: e.target.value })}
                    required
                  >
                    {gradeOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && planToNotify && (
        <div className="modal-overlay">
          <div className="confirm-modal" style={{ background: '#fff', padding: 24, borderRadius: 8, maxWidth: 400, margin: '120px auto' }}>
            <h3>Xác nhận gửi thông báo</h3>
            <p>Bạn có chắc chắn muốn gửi thông báo kế hoạch <b>{planToNotify.PlanName}</b> đến phụ huynh không?</p>
            {notifyMessage && <div style={{ color: notifyMessage.includes('thành công') ? 'green' : 'red', marginBottom: 8 }}>{notifyMessage}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="cancel-btn" onClick={() => setShowConfirmModal(false)} disabled={notifyLoading}>Hủy</button>
              <button className="submit-btn" onClick={handleSendNotificationsConfirmed} disabled={notifyLoading}>
                {notifyLoading ? 'Đang gửi...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationManagement;
