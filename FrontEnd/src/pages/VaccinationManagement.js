import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import './VaccinationManagement.css';
import '../components/Modal.css';

const VaccinationManagement = () => {
  const navigate = useNavigate();
  const { getUserRole, user: currentUser } = useAuth();
  const [vaccinationPlans, setVaccinationPlans] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filters, setFilters] = useState({
    scheduleDate: '',
    creatorId: '',
    grade: ''
  });
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
  const [showAddVaccineModal, setShowAddVaccineModal] = useState(false);
  const [addVaccineData, setAddVaccineData] = useState({ VaccineName: '', Description: '' });
  const [addVaccineLoading, setAddVaccineLoading] = useState(false);
  const [showVaccineManager, setShowVaccineManager] = useState(false);
  const [editVaccineId, setEditVaccineId] = useState(null);
  const [editVaccineData, setEditVaccineData] = useState({ VaccineName: '', Description: '' });
  const [deleteVaccineId, setDeleteVaccineId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const gradeOptions = ['Toàn trường', '6', '7', '8', '9'];
  const [availableCreators, setAvailableCreators] = useState([]);

  // Filter handlers
  const handleApplyFilters = () => {
    console.log("Applied filters:", filters);
    console.log("Filtered plans:", filteredPlans);
    console.log("All plans:", vaccinationPlans);
  };

  const handleResetFilters = () => {
    setFilters({
      scheduleDate: '',
      creatorId: '',
      grade: ''
    });
  };

  // Thống kê
  const totalStudents = vaccinationPlans.reduce((sum, plan) => sum + (plan.totalStudents || 0), 0);
  const completed = vaccinationPlans.reduce((sum, plan) => sum + (plan.completedCount || 0), 0);
  const pending = vaccinationPlans.reduce((sum, plan) => sum + (plan.pendingCount || 0), 0);
  const totalRounds = vaccinationPlans.length;

  // Toast notification
  const [showToast, setShowToast] = useState(false);
  const [showDateErrorModal, setShowDateErrorModal] = useState(false);
  const [dateErrorMessage, setDateErrorMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [searchTerm, filterStatus]);

  // Fetch available creators
  useEffect(() => {
    apiClient.get('/User')
      .then(res => {
        console.log('Creators API Response:', res);
        console.log('Creators data:', res.data);
        setAvailableCreators(res.data);
      })
      .catch(err => {
        console.error('Creators API Error:', err);
        setAvailableCreators([]);
      });
  }, []);



  // Filter logic giống HealthCheckManagement
  const filteredPlans = vaccinationPlans.filter(plan => {
    console.log('=== FILTER DEBUG ===');
    console.log('Current plan:', plan);
    console.log('Current filters:', filters);
    
    const matchDate = !filters.scheduleDate || (plan.scheduledDate && plan.scheduledDate.startsWith(filters.scheduleDate));
    console.log('Date match:', matchDate, 'Plan date:', plan.scheduledDate, 'Filter date:', filters.scheduleDate);
    
    // Filter theo creator - so sánh với tên hiển thị
    let matchCreator = true;
    if (filters.creatorId) {
      // Lấy tên hiển thị của creator từ availableCreators
      const creatorUser = availableCreators.find(u => 
        u.UserID === plan.creatorID || 
        u.userID === plan.creatorID ||
        u.Username === plan.creatorID ||
        u.username === plan.creatorID
      );
      
      const planCreatorDisplayName = creatorUser ? 
        (creatorUser.Username || creatorUser.username || creatorUser.FullName || creatorUser.fullName || plan.creatorID) : 
        (plan.creatorName || plan.creatorID);
      
      console.log('Creator comparison:', {
        planCreatorID: plan.creatorID,
        planCreatorName: plan.creatorName,
        planCreatorDisplayName: planCreatorDisplayName,
        filterCreator: filters.creatorId,
        creatorUser: creatorUser
      });
      
      matchCreator = planCreatorDisplayName.toString().toLowerCase().includes(filters.creatorId.toLowerCase());
      console.log('Creator match:', matchCreator);
    }
    
    // Filter theo khối
    let matchGrade = true;
    if (filters.grade) {
      const planGrade = plan.grade || plan.Grade || '';
      matchGrade = planGrade.toString().toLowerCase().includes(filters.grade.toLowerCase());
      console.log('Grade match:', matchGrade, 'Plan grade:', planGrade, 'Filter grade:', filters.grade);
    }
    
    const finalMatch = matchDate && matchCreator && matchGrade;
    console.log('Final match:', finalMatch, 'for plan ID:', plan.id);
    console.log('=== END FILTER DEBUG ===');
    
    return finalMatch;
  });

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

  useEffect(() => {
    if (notifyMessage && notifyMessage.includes('Thêm vaccine thành công')) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [notifyMessage]);

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
      const plans = plansResponse.data;

      // Fetch consent forms cho mỗi plan để tính toán thống kê
      const plansWithStats = await Promise.all(plans.map(async (plan) => {
        try {
          const consentResponse = await apiClient.get(`/VaccinationConsentForm/plan/${plan.vaccinationPlanID || plan.id}`);
          const consents = consentResponse.data || [];
          
          // Tính toán thống kê
          const totalStudents = consents.length;
          const confirmedCount = consents.filter(c => c.status === 'Approved').length;
          const pendingCount = consents.filter(c => c.status === 'Pending').length;
          const completedCount = consents.filter(c => c.status === 'Completed').length;
          
          return {
            ...plan,
            totalStudents,
            confirmedCount,
            pendingCount,
            completedCount
          };
        } catch (error) {
          console.error(`Error fetching consents for plan ${plan.vaccinationPlanID}:`, error);
          return {
            ...plan,
            totalStudents: 0,
            confirmedCount: 0,
            pendingCount: 0,
            completedCount: 0
          };
        }
      }));

      setVaccinationPlans(plansWithStats);
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
        setNotifyMessage('Vui lòng nhập đầy đủ tên kế hoạch và đảm bảo bạn đã đăng nhập!');
        setLoading(false);
        return;
      }
      // Kiểm tra ngày dự kiến
      if (formData.ScheduledDate) {
        const selectedDate = new Date(formData.ScheduledDate);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (selectedDate < today) {
          setDateErrorMessage('Ngày dự kiến phải lớn hơn hoặc bằng hôm nay!');
          setShowDateErrorModal(true);
          setLoading(false);
          return;
        }
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
      setNotifyMessage('Có lỗi khi tạo kế hoạch tiêm chủng!');
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
      setNotifyMessage('Có lỗi khi cập nhật kế hoạch!');
      console.error('Error updating plan:', error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // Thêm vaccine
  const handleAddVaccineInputChange = (e) => {
    const { id, value } = e.target;
    setAddVaccineData(prev => ({ ...prev, [id]: value }));
  };

  const handleAddVaccine = async (e) => {
    e.preventDefault();
    setAddVaccineLoading(true);
    setNotifyMessage('');
    try {
      console.log('Adding vaccine with data:', addVaccineData);
      
      if (!addVaccineData.VaccineName || !addVaccineData.Description) {
        setNotifyMessage('Vui lòng nhập đầy đủ tên vaccine và mô tả!');
        setAddVaccineLoading(false);
        return;
      }
      
      await apiClient.post('/VaccineType', {
        VaccineName: addVaccineData.VaccineName,
        Description: addVaccineData.Description
      });
      
      setAddVaccineData({ VaccineName: '', Description: '' });
      // Cập nhật lại danh sách vaccine
      const res = await apiClient.get('/VaccineType');
      setVaccineList(res.data);
      setNotifyMessage('Thêm vaccine thành công!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Error adding vaccine:', err);
      let msg = 'Có lỗi khi thêm vaccine!';
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') msg += ' ' + err.response.data;
        else if (err.response.data.title) msg += ' ' + err.response.data.title;
        else if (err.response.data.error) msg += ' ' + err.response.data.error;
        else msg += ' ' + JSON.stringify(err.response.data);
      }
      setNotifyMessage(msg);
    } finally {
      setAddVaccineLoading(false);
    }
  };

  // Quản lý vaccine
  const openVaccineManager = async () => {
    setShowVaccineManager(true);
    try {
      const res = await apiClient.get('/VaccineType');
      setVaccineList(res.data);
    } catch {}
  };
  const closeVaccineManager = () => {
    setShowVaccineManager(false);
    setEditVaccineId(null);
    setEditVaccineData({ VaccineName: '', Description: '' });
    setDeleteVaccineId(null);
  };
  const handleEditVaccineClick = (v) => {
    setEditVaccineId(v.vaccinationID || v.VaccinationID);
    setEditVaccineData({ VaccineName: v.vaccineName || v.VaccineName, Description: v.description || v.Description });
  };
  const handleEditVaccineInputChange = (e) => {
    const { id, value } = e.target;
    setEditVaccineData(prev => ({ ...prev, [id]: value }));
  };
  const handleEditVaccineSave = async (id) => {
    try {
      console.log('Updating vaccine with data:', {
        VaccinationID: id,
        VaccineName: editVaccineData.VaccineName,
        Description: editVaccineData.Description
      });
      
      await apiClient.put(`/VaccineType/${id}`, {
        VaccinationID: id,
        VaccineName: editVaccineData.VaccineName,
        Description: editVaccineData.Description
      });
      
      const res = await apiClient.get('/VaccineType');
      setVaccineList(res.data);
      setEditVaccineId(null);
      setEditVaccineData({ VaccineName: '', Description: '' });
      setNotifyMessage('Cập nhật vaccine thành công!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Error updating vaccine:', err);
      let msg = 'Có lỗi khi cập nhật vaccine!';
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') msg += ' ' + err.response.data;
        else if (err.response.data.title) msg += ' ' + err.response.data.title;
        else if (err.response.data.error) msg += ' ' + err.response.data.error;
        else msg += ' ' + JSON.stringify(err.response.data);
      }
      setNotifyMessage(msg);
    }
  };
  const handleDeleteVaccine = async (id) => {
    setDeleteLoading(true);
    try {
      console.log('Deleting vaccine with ID:', id);
      await apiClient.delete(`/VaccineType/${id}`);
      const res = await apiClient.get('/VaccineType');
      setVaccineList(res.data);
      setNotifyMessage('Xóa vaccine thành công!');
      setDeleteVaccineId(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Error deleting vaccine:', err);
      let msg = 'Có lỗi khi xóa vaccine!';
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') msg += ' ' + err.response.data;
        else if (err.response.data.title) msg += ' ' + err.response.data.title;
        else if (err.response.data.error) msg += ' ' + err.response.data.error;
        else msg += ' ' + JSON.stringify(err.response.data);
      }
      setNotifyMessage(msg);
    } finally {
      setDeleteLoading(false);
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
        {notifyMessage && <div className="notification-message">{notifyMessage}</div>}
      </div>

      {/* Thống kê */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card health-stat-card">
            <div className="card-body">
              <h5 className="card-title">Tổng số học sinh</h5>
              <p className="card-number">{totalStudents}</p>
              <p className="card-text">Đã đăng ký tiêm</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card health-stat-card">
            <div className="card-body">
              <h5 className="card-title">Đã tiêm</h5>
              <p className="card-number">{completed}</p>
              <p className="card-text">Học sinh</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card health-stat-card">
            <div className="card-body">
              <h5 className="card-title">Chờ tiêm</h5>
              <p className="card-number">{pending}</p>
              <p className="card-text">Học sinh</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card health-stat-card">
            <div className="card-body">
              <h5 className="card-title">Đợt tiêm</h5>
              <p className="card-number">{totalRounds.toString().padStart(2, '0')}</p>
              <p className="card-text">Năm học hiện tại</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Lọc danh sách kế hoạch</h5>
          <div className="row">
            <div className="col-md-4 mb-2">
          <input
                type="date"
                id="scheduleDate"
                className="form-control"
                value={filters.scheduleDate}
                onChange={(e) => setFilters(prev => ({ ...prev, scheduleDate: e.target.value }))}
                placeholder="Chọn ngày tiêm"
          />
        </div>
            <div className="col-md-4 mb-2">
          <select
                id="creatorId"
                className="form-select"
                value={filters.creatorId}
                onChange={(e) => setFilters(prev => ({ ...prev, creatorId: e.target.value }))}
          >
                <option value="">Chọn người tạo</option>
                <option value="medstaff01">medstaff01</option>
                <option value="admin01">admin01</option>
          </select>
            </div>
            <div className="col-md-4 mb-2">
              <select
                id="grade"
                className="form-select"
                value={filters.grade}
                onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value }))}
              >
                <option value="">Chọn khối</option>
                <option value="6">Khối 6</option>
                <option value="7">Khối 7</option>
                <option value="8">Khối 8</option>
                <option value="9">Khối 9</option>
                <option value="Toàn trường">Toàn trường</option>
              </select>
            </div>
            <div className="col-md-4 mb-2 d-flex align-items-end">
              <button className="btn btn-secondary" onClick={handleResetFilters}>Đặt lại</button>
            </div>
          </div>
        </div>
        </div>

      {/* Action Buttons */}
              <div className="d-flex justify-content-end mb-3">
          <button 
            className="btn btn-info me-2"
            onClick={openVaccineManager}
          >
            <i className="fas fa-syringe me-2"></i> QUẢN LÝ VACCINE
          </button>
          <button 
            className="btn btn-warning"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="fas fa-plus-circle me-2"></i> TẠO KẾ HOẠCH MỚI
          </button>
      </div>

      {/* Vaccination Plans List */}
      <div className="vaccination-plans-list">
        {filteredPlans.map((plan) => (
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
              <div className="plan-info-row">
              <div className="plan-description">
                <h4>Mô tả</h4>
                <p>{plan.description}</p>
                  <p><strong>Người tạo:</strong> {plan.creatorName || 'medstaff01'}</p>
              </div>

              <div className="plan-target">
                <h4>Đối tượng</h4>
                <p><strong>Khối:</strong> {plan.grade || 'Toàn trường'}</p>
                        </div>
              </div>

              <div className="plan-stats">
                <h4>Thống kê</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Tổng học sinh:</span>
                    <span className="stat-value">{plan.totalStudents || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Đã xác nhận:</span>
                    <span className="stat-value confirmed">{plan.confirmedCount || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Chờ phản hồi:</span>
                    <span className="stat-value pending">{plan.pendingCount || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Đã tiêm:</span>
                    <span className="stat-value completed">{plan.completedCount || 0}</span>
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

      {/* Form tạo kế hoạch tiêm chủng mới - Synchronized with HealthCheckManagement */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Tạo kế hoạch tiêm chủng mới</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
            </div>
              <div className="modal-body">
                {/* Hiển thị thông tin người tạo */}
                <div className="alert alert-info mb-3">
                  <i className="fas fa-user me-2"></i>
                  <strong>Người tạo:</strong> {currentUser?.fullName || currentUser?.FullName || currentUser?.username || currentUser?.Username || 'Không xác định'}
                </div>
                
                <form onSubmit={handleCreatePlan} className="individual-form">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="PlanName" className="form-label">Tên kế hoạch (Tên vaccine) *</label>
                  <select
                        className="form-select"
                        id="PlanName"
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
                    <div className="col-md-6 mb-3">
                      <label htmlFor="ScheduledDate" className="form-label">Ngày dự kiến *</label>
                  <input
                    type="date"
                        className="form-control"
                        id="ScheduledDate"
                    name="ScheduledDate"
                    value={formData.ScheduledDate ?? ""}
                    onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="Description" className="form-label">Mô tả *</label>
                  <textarea
                        className="form-control"
                        id="Description"
                    name="Description"
                        rows="3"
                    value={formData.Description ?? ""}
                    onChange={handleInputChange}
                    placeholder="Mô tả chi tiết về kế hoạch tiêm chủng..."
                    required
                  />
                </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="Status" className="form-label">Trạng thái *</label>
                  <select
                        className="form-select"
                        id="Status"
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
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="Grade" className="form-label">Khối *</label>
                  <select
                        className="form-select"
                        id="Grade"
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
                  

                  
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Hủy bỏ</button>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-calendar-check me-2"></i>Xác nhận kế hoạch
                </button>
              </div>
            </form>
              </div>
            </div>
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
                      <div className="stat-number">{completed}</div>
                      <div className="stat-label">Đã tiêm</div>
                    </div>
                  </div>
                  
                  <div className="stat-card pending">
                    <div className="stat-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">{pending}</div>
                      <div className="stat-label">Chờ phản hồi</div>
                    </div>
                  </div>
                  
                  <div className="stat-card completed">
                    <div className="stat-icon">
                      <i className="fas fa-syringe"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">{completed}</div>
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
                  const confirmedStudents = selectedPlan?.ConsentForms?.filter(f => f.StatusID === 1 || f.ConsentStatus === "Approved").map(f => f.Student);
                  navigate(`/vaccination-plan/${selectedPlan.id}/students`, { state: { students: confirmedStudents } });
                }}>
                  <i className="fas fa-users"></i> Xem danh sách học sinh
                </button>
                <button className="action-btn record-results" onClick={() => {
                  const confirmedStudents = selectedPlan?.ConsentForms?.filter(f => f.StatusID === 1 || f.ConsentStatus === "Approved").map(f => f.Student);
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
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            width: '90%',
            maxWidth: '480px',
            minWidth: '350px',
            animation: 'slideIn 0.3s ease',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <i className="fas fa-bell" style={{ color: '#ffffff', fontSize: '1.2rem' }}></i>
                </div>
                <h3 style={{
                  color: '#ffffff',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  margin: 0,
                  letterSpacing: '0.5px'
                }}>
                  Xác nhận gửi thông báo
                </h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: '#ffffff'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <i className="fas fa-times" style={{ fontSize: '1rem' }}></i>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '20px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  flexShrink: 0
                }}>
                  <i className="fas fa-info" style={{ color: '#ffffff', fontSize: '1.3rem' }}></i>
          </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: 0,
                    color: '#374151',
                    fontSize: '1.05rem',
                    lineHeight: '1.6',
                    fontWeight: '500'
                  }}>
                    Bạn có chắc chắn muốn gửi thông báo kế hoạch{' '}
                    <span style={{
                      color: '#1e40af',
                      fontWeight: '600',
                      background: 'linear-gradient(120deg, #dbeafe, #eff6ff)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {planToNotify.PlanName}
                    </span>
                    {' '}đến phụ huynh không?
                  </p>
                </div>
              </div>

              {notifyMessage && (
                <div style={{
                  padding: '16px',
                  borderRadius: '8px',
                  marginTop: '16px',
                  background: notifyMessage.includes('thành công') 
                    ? 'linear-gradient(135deg, #d1fae5, #ecfdf5)' 
                    : 'linear-gradient(135deg, #fee2e2, #fef2f2)',
                  border: `2px solid ${notifyMessage.includes('thành công') ? '#10b981' : '#ef4444'}`,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <i className={`fas ${notifyMessage.includes('thành công') ? 'fa-check-circle' : 'fa-exclamation-triangle'}`} 
                     style={{
                       color: notifyMessage.includes('thành công') ? '#059669' : '#dc2626',
                       fontSize: '1.2rem',
                       marginRight: '12px'
                     }}></i>
                  <span style={{
                    color: notifyMessage.includes('thành công') ? '#065f46' : '#991b1b',
                    fontSize: '0.95rem',
                    fontWeight: '500'
                  }}>
                    {notifyMessage}
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '20px 24px',
              background: '#f9fafb',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={notifyLoading}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '2px solid #d1d5db',
                  background: '#ffffff',
                  color: '#6b7280',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                <i className="fas fa-times" style={{ fontSize: '0.9rem' }}></i>
                Hủy
              </button>
              <button
                onClick={handleSendNotificationsConfirmed}
                disabled={notifyLoading}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: notifyLoading 
                    ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                    : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: notifyLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: notifyLoading ? 'none' : '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!notifyLoading) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 8px -1px rgba(59, 130, 246, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!notifyLoading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.3)';
                  }
                }}
              >
                {notifyLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '0.9rem' }}></i>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check" style={{ fontSize: '0.9rem' }}></i>
                    Xác nhận
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm vaccine */}
      {showAddVaccineModal && (
        <div className="modal-overlay">
          <div className="create-plan-modal" style={{ background: '#f4f8fb', minWidth: 400 }}>
            <div className="modal-header">
              <h3>Thêm vaccine mới</h3>
              <button className="close-btn" onClick={() => setShowAddVaccineModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleAddVaccine}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tên vaccine:</label>
                  <input
                    type="text"
                    name="VaccineName"
                    value={addVaccineData.VaccineName}
                    onChange={handleAddVaccineInputChange}
                    required
                    style={{ width: '100%', padding: 8, marginBottom: 12 }}
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả:</label>
                  <textarea
                    name="Description"
                    value={addVaccineData.Description}
                    onChange={handleAddVaccineInputChange}
                    rows={3}
                    style={{ width: '100%', padding: 8 }}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ textAlign: 'right' }}>
                <button type="button" className="close-btn" onClick={() => setShowAddVaccineModal(false)} style={{ marginRight: 8 }}>
                  Hủy
                </button>
                <button type="submit" className="create-plan-btn" disabled={addVaccineLoading}>
                  {addVaccineLoading ? 'Đang lưu...' : 'Xác nhận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Form quản lý vaccine - Synchronized with HealthCheckManagement */}
      {showVaccineManager && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Quản lý vaccine</h5>
                <button type="button" className="btn-close" onClick={closeVaccineManager}></button>
            </div>
            <div className="modal-body">
                {/* Hiển thị thông tin người tạo */}
                <div className="alert alert-info mb-3">
                  <i className="fas fa-user me-2"></i>
                  <strong>Người tạo:</strong> {currentUser?.fullName || currentUser?.FullName || currentUser?.username || currentUser?.Username || 'Không xác định'}
                </div>
                
                <form onSubmit={handleAddVaccine} className="vaccine-form">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="VaccineName" className="form-label">Tên vaccine *</label>
                  <input
                    type="text"
                        className="form-control"
                        id="VaccineName"
                    value={addVaccineData.VaccineName}
                    onChange={handleAddVaccineInputChange}
                        placeholder="Nhập tên vaccine"
                    required
                  />
                </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="Description" className="form-label">Mô tả *</label>
                      <textarea
                        className="form-control"
                        id="Description"
                        rows="2"
                    value={addVaccineData.Description}
                    onChange={handleAddVaccineInputChange}
                        placeholder="Nhập mô tả vaccine"
                    required
                  />
                </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-12 mb-3 d-flex justify-content-end">
                      <button type="submit" className="btn btn-primary" disabled={addVaccineLoading}>
                        <i className="fas fa-plus me-2"></i>
                        {addVaccineLoading ? 'Đang thêm...' : 'Thêm mới'}
                </button>
                    </div>
                  </div>
              </form>

                <div className="vaccine-list-section mt-4">
                  <h5 className="mb-3">Danh sách vaccine</h5>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                  <tr>
                          <th>Mã</th>
                          <th>Tên vaccine</th>
                          <th>Mô tả</th>
                          <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                        {vaccineList.map((vaccine) => (
                          <tr key={vaccine.vaccinationID || vaccine.VaccinationID}>
                            <td>{vaccine.vaccinationID || vaccine.VaccinationID}</td>
                            <td>
                              {editVaccineId === (vaccine.vaccinationID || vaccine.VaccinationID) ? (
                          <input
                            type="text"
                                  className="form-control form-control-sm"
                                  id="VaccineName"
                            value={editVaccineData.VaccineName}
                            onChange={handleEditVaccineInputChange}
                          />
                              ) : (
                                vaccine.vaccineName || vaccine.VaccineName
                              )}
                      </td>
                            <td>
                              {editVaccineId === (vaccine.vaccinationID || vaccine.VaccinationID) ? (
                                <textarea
                                  className="form-control form-control-sm"
                                  id="Description"
                            value={editVaccineData.Description}
                            onChange={handleEditVaccineInputChange}
                                  rows="2"
                          />
                              ) : (
                                vaccine.description || vaccine.Description
                              )}
                      </td>
                            <td>
                              {editVaccineId === (vaccine.vaccinationID || vaccine.VaccinationID) ? (
                                <div className="btn-group btn-group-sm">
                                  <button 
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => handleEditVaccineSave(vaccine.vaccinationID || vaccine.VaccinationID)}
                                  >
                                    <i className="fas fa-save"></i>
                                  </button>
                                  <button 
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setEditVaccineId(null)}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                        ) : (
                                <div className="btn-group btn-group-sm">
                                  <button 
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleEditVaccineClick(vaccine)}
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button 
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => setDeleteVaccineId(vaccine.vaccinationID || vaccine.VaccinationID)}
                                    disabled={deleteLoading}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeVaccineManager}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal xác nhận xóa vaccine */}
      {deleteVaccineId && (
        <div className="modal-overlay" style={{ zIndex: 10001, background: 'rgba(0,0,0,0.25)' }}>
          <div style={{
            background: '#fff',
            minWidth: 340,
            maxWidth: 400,
            margin: '120px auto',
            borderRadius: 12,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            padding: 32,
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: '#e53e3e' }}>Xác nhận xóa vaccine</div>
            <div style={{ marginBottom: 24 }}>Bạn có chắc chắn muốn xóa vaccine này không?</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button className="delete-btn" style={{ background: '#e53e3e', color: '#fff', padding: '8px 24px', borderRadius: 6 }} onClick={() => handleDeleteVaccine(deleteVaccineId)} disabled={deleteLoading}>Xóa</button>
              <button className="close-btn" style={{ padding: '8px 24px', borderRadius: 6 }} onClick={() => setDeleteVaccineId(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          background: '#38a169',
          color: '#fff',
          padding: '16px 32px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 9999,
          fontSize: 18,
          fontWeight: 500
        }}>
          {notifyMessage}
        </div>
      )}
      {showDateErrorModal && (
        <div className="modal-overlay" style={{ zIndex: 10001, background: 'rgba(0,0,0,0.25)' }}>
          <div style={{
            background: '#fff',
            minWidth: 340,
            maxWidth: 400,
            margin: '120px auto',
            borderRadius: 12,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            padding: 32,
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: '#e53e3e' }}>Lỗi ngày dự kiến</div>
            <div style={{ marginBottom: 24 }}>{dateErrorMessage}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button className="close-btn" style={{ padding: '8px 24px', borderRadius: 6 }} onClick={() => setShowDateErrorModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default VaccinationManagement;
