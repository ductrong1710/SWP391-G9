import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import healthRecordService from '../services/healthRecordService';
import medicalStaffService from '../services/medicalStaffService';
import './HealthRecord.css';

const HealthRecord = () => {
  const navigate = useNavigate();
  const { user, getUserRole } = useAuth();
  const [healthRecords, setHealthRecords] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({
    totalRecords: 0,
    approvedRecords: 0,
    pendingReview: 0,
    criticalRecords: 0
  });
  const [formData, setFormData] = useState({
    healthRecordID: '',
    studentID: '',
    parentID: '',
    allergies: '',
    chronicDiseases: '',
    treatmentHistory: '',
    eyesight: 10,
    hearing: 10,
    vaccinationHistory: '',
    note: '',
    parentContact: '',
    fullName: '',
    className: ''
  });

  // Fetch data with enhanced features
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const userRole = getUserRole();
      
      if (userRole === 'Parent') {
        // Parent logic remains the same
        const childrenRes = await healthRecordService.getChildrenByParent(user.userID);
        const childrenData = childrenRes.data;
        setChildren(childrenData);

        if (childrenData.length > 0) {
          const recordPromises = childrenData.map(child =>
            healthRecordService.getHealthRecordsByStudent(child.studentID)
          );
          const recordsRes = await Promise.all(recordPromises);
          const records = recordsRes.flatMap(res => res.data);
          setHealthRecords(records);
        }
      } else if (userRole === 'MedicalStaff') {
        // Enhanced medical staff data fetching
        const params = {
          page: currentPage,
          pageSize: pageSize,
          studentId: selectedChild || undefined,
          status: filterStatus !== 'all' ? filterStatus : undefined,
          search: searchTerm || undefined
        };

        // Fetch records with pagination
        const recordsRes = await medicalStaffService.getHealthRecords(params);
        setHealthRecords(Array.isArray(recordsRes.data) ? recordsRes.data : recordsRes.data || []);
        setTotalCount(recordsRes.totalCount || 0);
        setTotalPages(recordsRes.totalPages || 1);
        
        // Fetch students for filter
        const studentsData = await medicalStaffService.getStudentsForFilter();
        setChildren(studentsData);
        
        // Fetch statistics
        const statsData = await medicalStaffService.getHealthRecordStatistics();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setHealthRecords([]);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  }, [user, getUserRole, selectedChild, filterStatus, searchTerm, currentPage, pageSize]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [fetchData, user]);

  // Handle search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    switch (field) {
      case 'student':
        setSelectedChild(value);
        break;
      case 'status':
        setFilterStatus(value);
        break;
      default:
        break;
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle approve record
  const handleApproveRecord = async (recordId) => {
    try {
      await medicalStaffService.approveHealthRecord(recordId);
      alert('Đã phê duyệt hồ sơ thành công!');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error approving record:', error);
      alert('Có lỗi xảy ra khi phê duyệt hồ sơ.');
    }
  };

  // Handle reject record
  const handleRejectRecord = async (recordId) => {
    const note = prompt('Vui lòng nhập lý do từ chối:');
    if (note !== null) {
      try {
        await medicalStaffService.rejectHealthRecord(recordId, note);
        alert('Đã từ chối hồ sơ thành công!');
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error rejecting record:', error);
        alert('Có lỗi xảy ra khi từ chối hồ sơ.');
      }
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      const result = await medicalStaffService.exportHealthRecords('excel');
      alert(result.message || 'Xuất báo cáo thành công!');
    } catch (error) {
      console.error('Error exporting records:', error);
      alert('Có lỗi xảy ra khi xuất báo cáo.');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setSearchTerm('');
    setSelectedChild('');
    setFilterStatus('all');
    setCurrentPage(1);
    // fetchData will be called automatically due to useEffect dependencies
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted':
        return '#3182ce';
      case 'Under Review':
        return '#d69e2e';
      case 'Approved':
        return '#38a169';
      case 'Rejected':
        return '#e53e3e';
      default:
        return '#718096';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Submitted':
        return 'Đã gửi';
      case 'Under Review':
        return 'Đang xem xét';
      case 'Approved':
        return 'Đã phê duyệt';
      case 'Rejected':
        return 'Từ chối';
      default:
        return 'Không xác định';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Submitted':
        return 'status-submitted';
      case 'Under Review':
        return 'status-review';
      case 'Approved':
        return 'status-approved';
      case 'Rejected':
        return 'status-rejected';
      default:
        return 'status-unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Submitted':
        return 'fa-paper-plane';
      case 'Under Review':
        return 'fa-clock';
      case 'Approved':
        return 'fa-check-circle';
      case 'Rejected':
        return 'fa-times-circle';
      default:
        return 'fa-question-circle';
    }
  };

  const getHealthStatusColor = (healthStatus) => {
    switch (healthStatus) {
      case 'Khỏe mạnh':
        return '#38a169';
      case 'Cần theo dõi':
        return '#d69e2e';
      case 'Cần chú ý':
        return '#e53e3e';
      default:
        return '#718096';
    }
  };

  const getHealthStatusClass = (healthStatus) => {
    switch (healthStatus) {
      case 'Khỏe mạnh':
        return 'health-good';
      case 'Cần theo dõi':
        return 'health-warning';
      case 'Cần chú ý':
        return 'health-critical';
      default:
        return 'health-unknown';
    }
  };

  const getHealthStatusIcon = (healthStatus) => {
    switch (healthStatus) {
      case 'Khỏe mạnh':
        return 'fa-heart';
      case 'Cần theo dõi':
        return 'fa-exclamation-triangle';
      case 'Cần chú ý':
        return 'fa-exclamation-circle';
      default:
        return 'fa-question-circle';
    }
  };

  const handleCreateRecord = () => {
    setFormData({
      healthRecordID: '',
      studentID: '',
      parentID: '',
      allergies: '',
      chronicDiseases: '',
      treatmentHistory: '',
      eyesight: 10,
      hearing: 10,
      vaccinationHistory: '',
      note: '',
      parentContact: '',
      fullName: '',
      className: ''
    });
    setShowCreateModal(true);
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitRecord = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const recordToSubmit = {
        ...formData,
        studentID: selectedChild || formData.studentID,
        parentID: user.userID, 
        status: 'Submitted',
      };

      await healthRecordService.createHealthRecord(recordToSubmit);
      
      setShowCreateModal(false);
      alert('Tạo hồ sơ sức khỏe thành công!');
      
      // Force re-fetch
      setFilterStatus(prev => prev + ' ');

    } catch (error) {
      console.error('Error creating health record:', error);
      alert('Có lỗi xảy ra khi tạo hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  const getSymptomCount = (record) => {
    const symptoms = [
      record.hasFever, record.hasCough, record.hasShortnessOfBreath,
      record.hasFatigue, record.hasLossOfTaste, record.hasLossOfSmell,
      record.hasSoreThroat, record.hasHeadache, record.hasMusclePain,
      record.hasDiarrhea, record.hasNausea, record.hasVomiting,
      record.hasRunnyNose, record.hasCongestion, record.hasChills,
      record.hasBodyAches
    ];
    return symptoms.filter(symptom => symptom).length;
  };

  // FORM HEALTH RECORD LUÔN HIỂN THỊ KHI PARENT LOGIN
  const handleHealthRecordFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // 1. Gọi API lấy profile theo họ tên và lớp
      const profileRes = await apiClient.get('/Profile/search', {
        params: { name: formData.fullName, class: formData.className }
      });
      const studentProfile = profileRes.data;
      if (!studentProfile) {
        alert('Không tìm thấy học sinh với thông tin đã cung cấp.');
        setLoading(false);
        return;
      }

      // 2. Tạo bản ghi sức khỏe mới
      const newRecord = {
        studentID: studentProfile.userID,
        parentID: user.userID,
        allergies: formData.allergies || '',
        chronicDiseases: formData.chronicDiseases || '',
        treatmentHistory: formData.treatmentHistory || '',
        eyesight: parseInt(formData.eyesight) || 10,
        hearing: parseInt(formData.hearing) || 10,
        vaccinationHistory: formData.vaccinationHistory || '',
        note: formData.note || '',
        parentContact: formData.parentContact || '',
        status: 'Submitted'
      };

      await healthRecordService.createHealthRecord(newRecord);
      alert('Gửi thông tin sức khỏe thành công!');
      
      // 3. Reset form và tải lại dữ liệu
      setFormData({
        healthRecordID: '',
        studentID: '',
        parentID: '',
        allergies: '',
        chronicDiseases: '',
        treatmentHistory: '',
        eyesight: 10,
        hearing: 10,
        vaccinationHistory: '',
        note: '',
        parentContact: '',
        fullName: '',
        className: ''
      });
      // Force re-fetch
      setFilterStatus(prev => prev + ' ');

    } catch (error) {
      console.error('Error submitting health record:', error);
      alert('Có lỗi xảy ra khi gửi thông tin.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Đang tải dữ liệu...</div>;
  }

  // Giao diện cho phụ huynh
  if (getUserRole() === 'Parent') {
    return (
      <div className="health-record-container parent-view">
        {/* Header hiện đại */}
        <div className="declaration-header">
          <div className="header-content">
            <div className="header-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <h1 className="main-title">Khai báo hồ sơ sức khỏe</h1>
            <p className="sub-title">
              Cung cấp thông tin sức khỏe đầy đủ và chính xác để đảm bảo an toàn cho con em trong môi trường học đường
            </p>
          </div>
        </div>

        {/* Thẻ trạng thái sức khỏe */}
        <div className="health-status-cards">
          <div className="status-card submitted">
            <div className="status-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="status-content">
              <h3>{healthRecords.length}</h3>
              <p>Hồ sơ đã nộp</p>
            </div>
          </div>
          <div className="status-card approved">
            <div className="status-icon">
              <i className="fas fa-shield-check"></i>
            </div>
            <div className="status-content">
              <h3>{healthRecords.filter(r => r.status === 'Approved').length}</h3>
              <p>Đã phê duyệt</p>
            </div>
          </div>
          <div className="status-card pending">
            <div className="status-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="status-content">
              <h3>{healthRecords.filter(r => r.status === 'Submitted' || r.status === 'Under Review').length}</h3>
              <p>Đang xử lý</p>
            </div>
          </div>
        </div>

        {/* Form khai báo hiện đại */}
        <div className="health-declaration-form">
          <div className="form-header">
            <h2>
              <i className="fas fa-file-medical"></i>
              Khai báo thông tin sức khỏe
            </h2>
            <p>Vui lòng điền đầy đủ thông tin để đảm bảo sức khỏe tốt nhất cho con em</p>
          </div>

          <form onSubmit={handleHealthRecordFormSubmit} className="modern-form">
            {/* Thông tin học sinh */}
            <div className="form-section">
              <div className="section-header">
                <h3>
                  <i className="fas fa-user-graduate"></i>
                  Thông tin học sinh
                </h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">
                    <i className="fas fa-user"></i>
                    Họ và tên học sinh
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-input"
                    value={formData.fullName || ''}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên đầy đủ"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="className">
                    <i className="fas fa-chalkboard-teacher"></i>
                    Lớp học
                  </label>
                  <input
                    type="text"
                    id="className"
                    name="className"
                    className="form-input"
                    value={formData.className || ''}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 10A1, 11B2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Tiền sử bệnh tật */}
            <div className="form-section">
              <div className="section-header">
                <h3>
                  <i className="fas fa-history"></i>
                  Tiền sử bệnh tật
                </h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="allergies">
                    <i className="fas fa-exclamation-triangle"></i>
                    Dị ứng
                  </label>
                  <input
                    type="text"
                    id="allergies"
                    name="allergies"
                    className="form-input"
                    value={formData.allergies || ''}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Phấn hoa, thức ăn, thuốc..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="chronicDiseases">
                    <i className="fas fa-heartbeat"></i>
                    Bệnh mãn tính
                  </label>
                  <input
                    type="text"
                    id="chronicDiseases"
                    name="chronicDiseases"
                    className="form-input"
                    value={formData.chronicDiseases || ''}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Hen suyễn, tiểu đường, cao huyết áp..."
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="treatmentHistory">
                    <i className="fas fa-notes-medical"></i>
                    Lịch sử điều trị
                  </label>
                  <textarea
                    id="treatmentHistory"
                    name="treatmentHistory"
                    className="form-textarea"
                    value={formData.treatmentHistory || ''}
                    onChange={handleInputChange}
                    placeholder="Mô tả các lần điều trị, phẫu thuật đã thực hiện..."
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Đánh giá thị lực và thính lực */}
            <div className="form-section">
              <div className="section-header">
                <h3>
                  <i className="fas fa-eye"></i>
                  Đánh giá thị lực & thính lực
                </h3>
                <p className="section-desc">Đánh giá theo thang điểm 1-10 (10 là tốt nhất)</p>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="eyesight">Thị lực (điểm)</label>
                  <div className="rating-input">
                    <input
                      type="range"
                      id="eyesight"
                      name="eyesight"
                      min="1"
                      max="10"
                      value={formData.eyesight || 10}
                      onChange={handleInputChange}
                    />
                    <span className="rating-value">{formData.eyesight || 10}/10</span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="hearing">Thính lực (điểm)</label>
                  <div className="rating-input">
                    <input
                      type="range"
                      id="hearing"
                      name="hearing"
                      min="1"
                      max="10"
                      value={formData.hearing || 10}
                      onChange={handleInputChange}
                    />
                    <span className="rating-value">{formData.hearing || 10}/10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tiêm chủng */}
            <div className="form-section">
              <div className="section-header">
                <h3>
                  <i className="fas fa-syringe"></i>
                  Lịch sử tiêm chủng
                </h3>
              </div>
              <div className="form-group full-width">
                <label htmlFor="vaccinationHistory">
                  <i className="fas fa-calendar-check"></i>
                  Các loại vaccine đã tiêm
                </label>
                <textarea
                  id="vaccinationHistory"
                  name="vaccinationHistory"
                  className="form-textarea"
                  value={formData.vaccinationHistory || ''}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: BCG, DPT, MMR, Viêm gan B, COVID-19..."
                  rows="3"
                />
              </div>
            </div>

            {/* Liên hệ khẩn cấp */}
            <div className="form-section">
              <div className="section-header">
                <h3>
                  <i className="fas fa-phone-alt"></i>
                  Liên hệ khẩn cấp
                </h3>
              </div>
              <div className="form-group">
                <label htmlFor="parentContact">
                  <i className="fas fa-mobile-alt"></i>
                  Số điện thoại phụ huynh
                </label>
                <input
                  type="tel"
                  id="parentContact"
                  name="parentContact"
                  className="form-input"
                  value={formData.parentContact || ''}
                  onChange={handleInputChange}
                  placeholder="Số điện thoại liên hệ khẩn cấp"
                />
              </div>
            </div>

            {/* Ghi chú */}
            <div className="form-section">
              <div className="section-header">
                <h3>
                  <i className="fas fa-sticky-note"></i>
                  Ghi chú thêm
                </h3>
              </div>
              <div className="form-group full-width">
                <label htmlFor="note">
                  <i className="fas fa-comment-dots"></i>
                  Thông tin bổ sung
                </label>
                <textarea
                  id="note"
                  name="note"
                  className="form-textarea"
                  value={formData.note || ''}
                  onChange={handleInputChange}
                  placeholder="Các thông tin khác mà nhà trường cần biết..."
                  rows="4"
                />
              </div>
            </div>

            {/* Nút submit */}
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Gửi hồ sơ sức khỏe
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Lịch sử khai báo hiện đại */}
        <div className="health-records-history">
          <div className="history-header">
            <h2>
              <i className="fas fa-history"></i>
              Lịch sử hồ sơ sức khỏe
            </h2>
            <p>Theo dõi tình trạng các hồ sơ đã nộp</p>
          </div>
          
          {healthRecords.length > 0 ? (
            <div className="records-grid">
              {healthRecords.map(record => (
                <div key={record.healthRecordID} className="record-card modern">
                  <div className="record-header">
                    <div className="record-info">
                      <h4>{record.childName || formData.fullName}</h4>
                      <p className="record-class">{record.childClass || formData.className}</p>
                    </div>
                    <div className="record-status">
                      <span className={`status-badge ${getStatusClass(record.status)}`}>
                        <i className={`fas ${getStatusIcon(record.status)}`}></i>
                        {getStatusText(record.status)}
                      </span>
                    </div>
                  </div>
                  <div className="record-body">
                    <div className="record-meta">
                      <p>
                        <i className="fas fa-calendar"></i>
                        <strong>Ngày nộp:</strong> {new Date(record.recordDate).toLocaleDateString('vi-VN')}
                      </p>
                      <p>
                        <i className="fas fa-eye"></i>
                        <strong>Thị lực:</strong> {record.eyesight || 10}/10
                      </p>
                      <p>
                        <i className="fas fa-ear"></i>
                        <strong>Thính lực:</strong> {record.hearing || 10}/10
                      </p>
                    </div>
                    {record.note && (
                      <div className="record-note">
                        <p><strong>Ghi chú:</strong> {record.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-records">
              <div className="no-records-icon">
                <i className="fas fa-file-medical"></i>
              </div>
              <h3>Chưa có hồ sơ nào</h3>
              <p>Hãy khai báo hồ sơ sức khỏe đầu tiên cho con em</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Giao diện cho nhân viên y tế (đơn giản và hiện đại)
  return (
    <div className="health-record-management-container">
      <div className="container py-4">
        {/* Header với tiêu đề và nút tạo mới */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1>Tra cứu hồ sơ sức khỏe</h1>
            <p className="text-muted">Quản lý và theo dõi hồ sơ sức khỏe học sinh</p>
          </div>
          <div>
            <button className="btn btn-primary" onClick={handleCreateRecord}>
              <i className="fas fa-plus-circle me-2"></i>Tạo hồ sơ mới
            </button>
          </div>
        </div>

        {/* Thẻ thống kê */}
        <div className="stats-cards-container mb-4">
          <div className="row g-3">
            <div className="col-xl-3 col-md-6">
              <div className="card health-stat-card total-records">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="stat-icon">
                      <i className="fas fa-file-medical"></i>
                    </div>
                    <div className="stat-content">
                      <h5 className="card-title">Tổng hồ sơ</h5>
                      <p className="card-number">{stats.totalRecords || totalCount}</p>
                      <p className="card-text">Hồ sơ sức khỏe</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card health-stat-card approved-records">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="stat-icon">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stat-content">
                      <h5 className="card-title">Đã phê duyệt</h5>
                      <p className="card-number">{stats.approvedRecords || healthRecords.filter(r => r.status === 'Approved').length}</p>
                      <p className="card-text">Hồ sơ được duyệt</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card health-stat-card pending-records">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="stat-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-content">
                      <h5 className="card-title">Đang xem xét</h5>
                      <p className="card-number">{stats.pendingReview || healthRecords.filter(r => r.status === 'Under Review' || r.status === 'Submitted').length}</p>
                      <p className="card-text">Cần xử lý</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card health-stat-card attention-records">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="stat-icon">
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div className="stat-content">
                      <h5 className="card-title">Cần chú ý</h5>
                      <p className="card-number">{stats.criticalRecords || healthRecords.filter(r => getSymptomCount(r) > 3).length}</p>
                      <p className="card-text">Triệu chứng nhiều</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <div className="card filter-card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">
              <i className="fas fa-filter me-2"></i>Lọc và tìm kiếm
            </h5>
            <div className="row g-3">
              <div className="col-lg-4 col-md-6">
                <label className="form-label">Tìm kiếm học sinh</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fas fa-search"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tên học sinh..."
                    value={searchTerm}
                    onChange={e => handleSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <label className="form-label">Học sinh</label>
                <select
                  className="form-select"
                  value={selectedChild}
                  onChange={e => handleFilterChange('student', e.target.value)}
                >
                  <option value="">Tất cả học sinh</option>
                  {children.map(child => (
                    <option key={child.id} value={child.id}>
                      {child.name} - {child.className}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-3 col-md-6">
                <label className="form-label">Trạng thái</label>
                <select
                  className="form-select"
                  value={filterStatus}
                  onChange={e => handleFilterChange('status', e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Submitted">Đã gửi</option>
                  <option value="Under Review">Đang xem xét</option>
                  <option value="Approved">Đã phê duyệt</option>
                  <option value="Rejected">Từ chối</option>
                </select>
              </div>
              <div className="col-lg-2 col-md-6">
                <label className="form-label">&nbsp;</label>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary" onClick={handleRefresh}>
                    <i className="fas fa-sync-alt"></i>
                  </button>
                  <button className="btn btn-outline-success" onClick={handleExport}>
                    <i className="fas fa-download"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách hồ sơ */}
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3">Đang tải dữ liệu hồ sơ sức khỏe...</p>
          </div>
        ) : (
          <div className="records-grid">
            {healthRecords.length > 0 ? (
              <div className="row g-3">
                {healthRecords.map((record) => (
                  <div key={record.id} className="col-xl-6 col-lg-12">
                    <div className="record-card">
                      <div className="record-header">
                        <div className="record-title">
                          <h3 className="record-student-name">{record.childName || 'Không rõ tên'}</h3>
                          <div className="record-meta-inline">
                            <span className="record-date">
                              <i className="fas fa-calendar me-2"></i>
                              {record.recordDate ? new Date(record.recordDate).toLocaleDateString('vi-VN') : 'N/A'}
                            </span>
                            <span className="record-class">
                              <i className="fas fa-users me-2"></i>
                              {record.childClass || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="record-status-wrapper">
                          <span className={`status-badge ${getStatusClass(record.status)}`}>
                            <i className={`fas ${getStatusIcon(record.status)} me-1`}></i>
                            {getStatusText(record.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="record-content">
                        <div className="health-info-grid">
                          <div className="health-info-item">
                            <strong>Tình trạng:</strong>
                            <span className={`health-status-badge ${getHealthStatusClass(record.healthStatus)}`}>
                              <i className={`fas ${getHealthStatusIcon(record.healthStatus)} me-1`}></i>
                              {record.healthStatus || 'Chưa đánh giá'}
                            </span>
                          </div>
                          <div className="health-info-item">
                            <strong>Triệu chứng:</strong>
                            <span className="symptom-count">
                              {getSymptomCount(record)} triệu chứng
                              {getSymptomCount(record) > 3 && <i className="fas fa-exclamation-triangle text-warning ms-2"></i>}
                            </span>
                          </div>
                        </div>
                        
                        {record.note && (
                          <div className="record-note">
                            <strong>Ghi chú:</strong> 
                            <span>{record.note.length > 100 ? record.note.substring(0, 100) + '...' : record.note}</span>
                          </div>
                        )}
                        
                        <div className="record-actions">
                          <button className="btn btn-outline-info btn-sm" onClick={() => handleViewDetails(record)}>
                            <i className="fas fa-eye me-1"></i> Chi tiết
                          </button>
                          {record.status === 'Submitted' && (
                            <>
                              <button className="btn btn-outline-success btn-sm" onClick={() => handleApproveRecord(record.id)}>
                                <i className="fas fa-check me-1"></i> Duyệt
                              </button>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => handleRejectRecord(record.id)}>
                                <i className="fas fa-times me-1"></i> Từ chối
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results text-center my-5">
                <i className="fas fa-file-medical fa-3x mb-3" style={{color:'#bdbdbd'}}></i>
                <h4>Không tìm thấy hồ sơ sức khỏe</h4>
                <p className="text-muted">Thử thay đổi bộ lọc hoặc tạo hồ sơ mới</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                </li>
                {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = index + 1;
                  } else if (currentPage <= 3) {
                    pageNum = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + index;
                  } else {
                    pageNum = currentPage - 2 + index;
                  }
                  
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(pageNum)}>
                        {pageNum}
                      </button>
                    </li>
                  );
                })}
                <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Modal chi tiết hồ sơ */}
      {showDetailsModal && selectedRecord && (
        <div className="modal show d-block" tabIndex="-1" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h3>
                  <i className="fas fa-file-medical"></i> Chi tiết hồ sơ sức khỏe
                </h3>
                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h5>Thông tin học sinh</h5>
                    <p><strong>Họ tên:</strong> {selectedRecord.childName || 'N/A'}</p>
                    <p><strong>Lớp:</strong> {selectedRecord.childClass || 'N/A'}</p>
                    <p><strong>Ngày ghi nhận:</strong> {selectedRecord.recordDate ? new Date(selectedRecord.recordDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    <p><strong>Trạng thái:</strong> 
                      <span className={`status-badge ${getStatusClass(selectedRecord.status)} ms-2`}>
                        <i className={`fas ${getStatusIcon(selectedRecord.status)} me-1`}></i>
                        {getStatusText(selectedRecord.status)}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h5>Tình trạng sức khỏe</h5>
                    <p><strong>Tổng quan:</strong> 
                      <span className={`health-status-badge ${getHealthStatusClass(selectedRecord.healthStatus)} ms-2`}>
                        <i className={`fas ${getHealthStatusIcon(selectedRecord.healthStatus)} me-1`}></i>
                        {selectedRecord.healthStatus || 'Chưa đánh giá'}
                      </span>
                    </p>
                    <p><strong>Số triệu chứng:</strong> {getSymptomCount(selectedRecord)} triệu chứng</p>
                    <p><strong>Dị ứng:</strong> {selectedRecord.allergies || 'Không có'}</p>
                    <p><strong>Bệnh mãn tính:</strong> {selectedRecord.chronicDiseases || 'Không có'}</p>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-6">
                    <p><strong>Thị lực:</strong> {selectedRecord.eyesight || 'Bình thường'}</p>
                    <p><strong>Thính lực:</strong> {selectedRecord.hearing || 'Bình thường'}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Lịch sử điều trị:</strong> {selectedRecord.treatmentHistory || 'Không có'}</p>
                    <p><strong>Tiêm chủng:</strong> {selectedRecord.vaccinationHistory || 'Không có'}</p>
                  </div>
                </div>
                {selectedRecord.note && (
                  <div className="row mt-3">
                    <div className="col-md-12">
                      <h5>Ghi chú</h5>
                      <p>{selectedRecord.note}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
                  Đóng
                </button>
                {selectedRecord.status === 'Submitted' && (
                  <>
                    <button type="button" className="btn btn-success" onClick={() => handleApproveRecord(selectedRecord.id)}>
                      <i className="fas fa-check me-1"></i> Phê duyệt
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => handleRejectRecord(selectedRecord.id)}>
                      <i className="fas fa-times me-1"></i> Từ chối
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal tạo/chỉnh sửa hồ sơ */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" onClick={() => setShowCreateModal(false)}>
          <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h3>Tạo hồ sơ sức khỏe mới</h3>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitRecord}>
                  <div className="mb-3">
                    <label className="form-label">Học sinh</label>
                    <select 
                      className="form-select" 
                      name="studentID"
                      value={formData.studentID}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn học sinh</option>
                      {children.map(child => (
                        <option key={child.id} value={child.id}>
                          {child.name} - {child.className}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Dị ứng</label>
                        <input 
                          type="text" 
                          className="form-control"
                          name="allergies"
                          value={formData.allergies}
                          onChange={handleInputChange}
                          placeholder="Nhập thông tin dị ứng..."
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Bệnh mãn tính</label>
                        <input 
                          type="text" 
                          className="form-control"
                          name="chronicDiseases"
                          value={formData.chronicDiseases}
                          onChange={handleInputChange}
                          placeholder="Nhập thông tin bệnh mãn tính..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Lịch sử điều trị</label>
                    <textarea 
                      className="form-control"
                      name="treatmentHistory"
                      rows="2"
                      value={formData.treatmentHistory}
                      onChange={handleInputChange}
                      placeholder="Nhập lịch sử điều trị..."
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Thị lực (1-10 điểm)</label>
                        <input 
                          type="number" 
                          className="form-control"
                          name="eyesight"
                          min="1"
                          max="10"
                          value={formData.eyesight}
                          onChange={handleInputChange}
                          placeholder="10"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Thính lực (1-10 điểm)</label>
                        <input 
                          type="number" 
                          className="form-control"
                          name="hearing"
                          min="1"
                          max="10"
                          value={formData.hearing}
                          onChange={handleInputChange}
                          placeholder="10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Lịch sử tiêm chủng</label>
                    <textarea 
                      className="form-control"
                      name="vaccinationHistory"
                      rows="2"
                      value={formData.vaccinationHistory}
                      onChange={handleInputChange}
                      placeholder="Nhập lịch sử tiêm chủng..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Liên hệ phụ huynh</label>
                    <input 
                      type="text" 
                      className="form-control"
                      name="parentContact"
                      value={formData.parentContact}
                      onChange={handleInputChange}
                      placeholder="Số điện thoại phụ huynh..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Ghi chú</label>
                    <textarea 
                      className="form-control"
                      name="note"
                      rows="3"
                      value={formData.note}
                      onChange={handleInputChange}
                      placeholder="Nhập ghi chú thêm..."
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Hủy
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSubmitRecord} disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'Tạo hồ sơ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthRecord;
