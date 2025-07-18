import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SendMedicine.css';
import apiClient from '../services/apiClient';
import ErrorDialog from '../components/ErrorDialog';

const SendMedicine = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState(null);  const [showForm, setShowForm] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState('individual');

  // State cho form đơn lẻ (theo cấu trúc bảng Medication_Submission_Form)
  const [formData, setFormData] = useState({
    studentID: '',
    parentID: '',
    patientName: '',
    patientId: '',
    class: '',
    medication_Name: '',
    dosage: '',
    instructions: '',
    consumption_Time: 'Ngày 2 lần',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'Đang xử lý',
    parents_Note: ''
  });

  // State cho các bộ lọc
  const [filters, setFilters] = useState({
    grade: '',
    className: '',
    status: ''
  });

  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  // Kiểm tra xác thực
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: { pathname: '/send-medicine' },
          manualLogin: true 
        } 
      });
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.grade) params.append('grade', filters.grade);
        if (filters.className) params.append('className', filters.className);
        if (filters.status) params.append('status', filters.status);
        
        const response = await apiClient.get(`/MedicationSubmission?${params.toString()}`);
        setMedicines(response.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu gửi thuốc:", error);
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  // Handler for new medicine request (individual)
  const handleNewMedicine = () => {
    setShowForm(true);
  };

  // Handlers
  const handleViewDetails = (medicine) => {
    setSelectedMedicine(medicine);
  };

  const handleCloseDetails = () => {
    setSelectedMedicine(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    // Auto-calculate end date if start date changes and consumption time is selected
    if (id === 'startDate' && value && formData.consumption_Time) {
      const startDate = new Date(value);
      let endDate = new Date(startDate);
      
      // Default duration based on consumption frequency
      if (formData.consumption_Time.includes('Ngày')) {
        endDate.setDate(startDate.getDate() + 7); // Default 7 days
      } else {
        endDate.setDate(startDate.getDate() + 3); // Default 3 days for "Khi cần"
      }
      
      setFormData(prev => ({
        ...prev,
        endDate: endDate.toISOString().split('T')[0]
      }));
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare data according to Medication_Submission_Form table structure
      const submissionData = {
        studentID: formData.patientId,
        parentID: formData.parentID || 'P00001', // Default or get from auth context
        medication_Name: formData.medication_Name,
        dosage: formData.dosage,
        instructions: formData.instructions,
        consumption_Time: formData.consumption_Time,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: 'Đang xử lý',
        parents_Note: formData.parents_Note,
        // Keep backward compatibility
        patientName: formData.patientName,
        class: formData.class
      };

      await apiClient.post('/MedicationSubmission', submissionData);
      setShowForm(false);
      
      // Reset form
      setFormData({
        studentID: '',
        parentID: '',
        patientName: '',
        patientId: '',
        class: '',
        medication_Name: '',
        dosage: '',
        instructions: '',
        consumption_Time: 'Ngày 2 lần',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'Đang xử lý',
        parents_Note: ''
      });
      
      // Show success message with better styling
      const successAlert = document.createElement('div');
      successAlert.className = 'alert alert-success position-fixed';
      successAlert.style.cssText = `
        top: 20px; 
        right: 20px; 
        z-index: 9999; 
        min-width: 300px;
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        color: white;
        border: none;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(67, 233, 123, 0.3);
      `;
      successAlert.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        <strong>Thành công!</strong> Đơn thuốc đã được tạo và gửi đến nhà trường.
      `;
      document.body.appendChild(successAlert);
      
      setTimeout(() => {
        document.body.removeChild(successAlert);
      }, 5000);
      
      // Reload data
      setFilters(prev => ({...prev}));
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu thuốc:', error);
      setError('Đã xảy ra lỗi khi gửi đơn thuốc. Vui lòng thử lại.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };  

  const handleApplyFilters = () => {
    // useEffect lo việc fetch lại dữ liệu khi filter thay đổi
    console.log("Applying filters:", filters);
  };

  const handleResetFilters = () => {
    setFilters({
      grade: '',
      className: '',
      status: ''
    });
  };

  const handleExportToExcel = () => {
    alert('Tính năng xuất Excel đang được phát triển!');
  };

  const handleImportFromExcel = () => {
    alert('Tính năng nhập từ Excel đang được phát triển!');
  };
  return (
    <div className="send-medicine-container">
      <div className="container py-4">
        {/* Header */}
        <div className="alert alert-info mb-4 fade-in-up">
          <div className="d-flex align-items-center">
            <i className="fas fa-info-circle me-3" style={{fontSize: '1.5rem'}}></i>
            <div>
              <strong>Hướng dẫn gửi thuốc:</strong> Phụ huynh có thể gửi thuốc cho học sinh thông qua hệ thống nhà trường. 
              Vui lòng điền đầy đủ thông tin thuốc và hướng dẫn sử dụng để nhà trường phát thuốc đúng cho học sinh.
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-4 fade-in-up">
          <h1><i className="fas fa-pills me-3"></i>Gửi thuốc cho học sinh</h1>
          <button className="btn btn-primary" onClick={handleNewMedicine}>
            <i className="fas fa-plus-circle me-2"></i>Gửi thuốc mới
          </button>
        </div>

        {/* Summary Cards */}
        <div className="row mb-4 fade-in-up">
          <div className="col-md-3 mb-3">
            <div className="card health-stat-card">
              <div className="card-body text-center">
                <i className="fas fa-clipboard-list mb-2" style={{fontSize: '2.5rem'}}></i>
                <h5 className="card-title">Tổng đơn thuốc</h5>
                <p className="card-number">{medicines.length}</p>
                <p className="card-text">Đã đăng ký</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card health-stat-card">
              <div className="card-body text-center">
                <i className="fas fa-check-circle mb-2" style={{fontSize: '2.5rem'}}></i>
                <h5 className="card-title">Đã phát thuốc</h5>
                <p className="card-number">{medicines.filter(m => m.status === 'Đã phát' || m.status === 'Đã gửi').length}</p>
                <p className="card-text">Đơn thuốc</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card health-stat-card">
              <div className="card-body text-center">
                <i className="fas fa-clock mb-2" style={{fontSize: '2.5rem'}}></i>
                <h5 className="card-title">Đang xử lý</h5>
                <p className="card-number">{medicines.filter(m => m.status === 'Đang xử lý').length}</p>
                <p className="card-text">Đơn thuốc</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card health-stat-card">
              <div className="card-body text-center">
                <i className="fas fa-calendar-alt mb-2" style={{fontSize: '2.5rem'}}></i>
                <h5 className="card-title">Tháng này</h5>
                <p className="card-number">
                  {medicines.filter(m => {
                    const medicineDate = new Date(m.startDate || m.dateOrdered);
                    const currentMonth = new Date().getMonth();
                    return medicineDate.getMonth() === currentMonth;
                  }).length}
                </p>
                <p className="card-text">Đơn thuốc mới</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Card */}
        <div className="card filter-section fade-in-up">
          <div className="card-body">
            <h5 className="card-title mb-3">
              <i className="fas fa-filter me-2"></i>Lọc danh sách gửi thuốc
            </h5>
            <div className="row">
              <div className="col-md-3 mb-2">
                <label className="form-label">Khối lớp</label>
                <select 
                  id="grade" 
                  className="form-select"
                  value={filters.grade ?? ""}
                  onChange={(e) => setFilters({...filters, grade: e.target.value})}
                >
                  <option value="">Tất cả khối</option>
                  <option value="6">Khối 6</option>
                  <option value="7">Khối 7</option>
                  <option value="8">Khối 8</option>
                  <option value="9">Khối 9</option>
                </select>
              </div>
              <div className="col-md-3 mb-2">
                <label className="form-label">Lớp học</label>
                <select 
                  id="className" 
                  className="form-select"
                  value={filters.className ?? ""}
                  onChange={(e) => setFilters({...filters, className: e.target.value})}
                >
                  <option value="">Tất cả lớp</option>
                  <option value="6A">6A</option>
                  <option value="6B">6B</option>
                  <option value="6C">6C</option>
                  <option value="7A">7A</option>
                  <option value="7B">7B</option>
                  <option value="7C">7C</option>
                  <option value="8A">8A</option>
                  <option value="8B">8B</option>
                  <option value="8C">8C</option>
                  <option value="9A">9A</option>
                  <option value="9B">9B</option>
                  <option value="9C">9C</option>
                </select>
              </div>
              <div className="col-md-3 mb-2">
                <label className="form-label">Trạng thái</label>
                <select 
                  id="status" 
                  className="form-select"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đã phát">Đã phát</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
              <div className="col-md-3 mb-2">
                <label className="form-label">&nbsp;</label>
                <div className="d-flex">
                  <button className="btn btn-primary flex-grow-1 me-2" onClick={handleApplyFilters}>
                    <i className="fas fa-search me-2"></i>Tìm kiếm
                  </button>
                  <button className="btn btn-secondary" onClick={handleResetFilters}>
                    <i className="fas fa-redo"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export/Import Buttons */}
        <div className="d-flex justify-content-end mb-3 btn-export-import fade-in-up">
          <button className="btn btn-outline-success me-2" onClick={handleExportToExcel}>
            <i className="fas fa-file-excel me-2"></i>Xuất Excel
          </button>
          <button className="btn btn-outline-primary" onClick={handleImportFromExcel}>
            <i className="fas fa-file-import me-2"></i>Nhập danh sách
          </button>
        </div>        {/* Main Table */}
        {loading ? (
          <div className="text-center my-5 fade-in-up">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3" style={{color: '#667eea', fontWeight: '600'}}>Đang tải dữ liệu gửi thuốc...</p>
          </div>
        ) : (
          <div className="card fade-in-up">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <i className="fas fa-list-alt me-2"></i>Danh sách đơn thuốc
                </h5>
                <span className="badge bg-primary">{medicines.length} đơn thuốc</span>
              </div>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th><i className="fas fa-hashtag me-1"></i>ID</th>
                      <th><i className="fas fa-user-graduate me-1"></i>Mã HS</th>
                      <th><i className="fas fa-user me-1"></i>Họ tên</th>
                      <th><i className="fas fa-school me-1"></i>Lớp</th>
                      <th><i className="fas fa-pills me-1"></i>Tên thuốc</th>
                      <th><i className="fas fa-prescription-bottle me-1"></i>Liều lượng</th>
                      <th><i className="fas fa-calendar me-1"></i>Ngày bắt đầu</th>
                      <th><i className="fas fa-calendar-check me-1"></i>Ngày kết thúc</th>
                      <th><i className="fas fa-info-circle me-1"></i>Trạng thái</th>
                      <th><i className="fas fa-cogs me-1"></i>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.length > 0 ? (
                      medicines.map((medicine) => (
                        <tr key={medicine.id}>
                          <td><strong>{medicine.id}</strong></td>
                          <td>
                            <span className="badge bg-secondary">{medicine.patientId || medicine.studentID}</span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm me-2">
                                <i className="fas fa-user-circle text-primary" style={{fontSize: '1.5rem'}}></i>
                              </div>
                              <strong>{medicine.patientName}</strong>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info">{medicine.class}</span>
                          </td>
                          <td>
                            <span className="text-primary fw-bold">{medicine.medicineName || medicine.medication_Name}</span>
                          </td>
                          <td>{medicine.dosage}</td>
                          <td>
                            <small className="text-muted">
                              <i className="fas fa-calendar-alt me-1"></i>
                              {medicine.startDate || medicine.dateOrdered}
                            </small>
                          </td>
                          <td>
                            <small className="text-muted">
                              <i className="fas fa-calendar-alt me-1"></i>
                              {medicine.endDate || 'Chưa xác định'}
                            </small>
                          </td>
                          <td>
                            <span className={`badge ${
                              medicine.status === 'Đã phát' || medicine.status === 'Đã gửi'
                                ? 'bg-success' 
                                : medicine.status === 'Đang xử lý'
                                ? 'bg-primary'
                                : 'bg-warning'
                            }`}>
                              <span className={`status-indicator ${
                                medicine.status === 'Đã phát' || medicine.status === 'Đã gửi'
                                  ? 'status-completed'
                                  : medicine.status === 'Đang xử lý'
                                  ? 'status-processing'
                                  : 'status-pending'
                              }`}></span>
                              {medicine.status}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-sm btn-info"
                                onClick={() => handleViewDetails(medicine)}
                                title="Xem chi tiết"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-secondary"
                                title="Chỉnh sửa"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              {medicine.status === 'Đang xử lý' && (
                                <button 
                                  className="btn btn-sm btn-danger"
                                  title="Hủy đơn"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center py-5">
                          <div className="text-muted">
                            <i className="fas fa-pills mb-3" style={{fontSize: '3rem', opacity: '0.3'}}></i>
                            <p className="mb-0" style={{fontSize: '1.1rem'}}>Không có dữ liệu đơn thuốc nào phù hợp với điều kiện lọc</p>
                            <small>Hãy thử thay đổi bộ lọc hoặc tạo đơn thuốc mới</small>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Medicine Details Modal */}
        {selectedMedicine && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-pills me-2"></i>Chi tiết đơn thuốc
                  </h5>
                  <button type="button" className="btn-close" onClick={handleCloseDetails}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="info-group mb-3">
                        <label className="info-label">
                          <i className="fas fa-user-graduate me-2 text-primary"></i>Mã học sinh:
                        </label>
                        <span className="info-value badge bg-secondary">{selectedMedicine.patientId || selectedMedicine.studentID}</span>
                      </div>
                      <div className="info-group mb-3">
                        <label className="info-label">
                          <i className="fas fa-user me-2 text-success"></i>Họ tên:
                        </label>
                        <span className="info-value">{selectedMedicine.patientName}</span>
                      </div>
                      <div className="info-group mb-3">
                        <label className="info-label">
                          <i className="fas fa-school me-2 text-info"></i>Lớp:
                        </label>
                        <span className="info-value badge bg-info">{selectedMedicine.class}</span>
                      </div>
                      <div className="info-group mb-3">
                        <label className="info-label">
                          <i className="fas fa-pills me-2 text-warning"></i>Tên thuốc:
                        </label>
                        <span className="info-value fw-bold text-primary">{selectedMedicine.medicineName || selectedMedicine.medication_Name}</span>
                      </div>
                      <div className="info-group mb-3">
                        <label className="info-label">
                          <i className="fas fa-prescription-bottle me-2 text-danger"></i>Liều lượng:
                        </label>
                        <span className="info-value">{selectedMedicine.dosage}</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="info-group mb-3">
                        <label className="info-label">
                          <i className="fas fa-clock me-2 text-primary"></i>Tần suất sử dụng:
                        </label>
                        <span className="info-value">{selectedMedicine.frequency || selectedMedicine.consumption_Time}</span>
                      </div>
                      <div className="info-group mb-3">
                        <label className="info-label">
                          <i className="fas fa-calendar-alt me-2 text-success"></i>Ngày bắt đầu:
                        </label>
                        <span className="info-value">{selectedMedicine.startDate || selectedMedicine.dateOrdered}</span>
                      </div>
                      <div className="info-group mb-3">
                        <label className="info-label">
                          <i className="fas fa-calendar-check me-2 text-info"></i>Ngày kết thúc:
                        </label>
                        <span className="info-value">{selectedMedicine.endDate || 'Chưa xác định'}</span>
                      </div>
                      <div className="info-group mb-3">
                        <label className="info-label">
                          <i className="fas fa-map-marker-alt me-2 text-warning"></i>Địa điểm nhận:
                        </label>
                        <span className="info-value">{selectedMedicine.deliveryAddress || 'Phòng Y tế Trường'}</span>
                      </div>
                      <div className="info-group mb-3">
                        <label className="info-label">
                          <i className="fas fa-info-circle me-2 text-danger"></i>Trạng thái:
                        </label>
                        <span className={`badge ${
                          selectedMedicine.status === 'Đã phát' || selectedMedicine.status === 'Đã gửi'
                            ? 'bg-success' 
                            : selectedMedicine.status === 'Đang xử lý'
                            ? 'bg-primary'
                            : 'bg-warning'
                        }`}>
                          <span className={`status-indicator ${
                            selectedMedicine.status === 'Đã phát' || selectedMedicine.status === 'Đã gửi'
                              ? 'status-completed'
                              : selectedMedicine.status === 'Đang xử lý'
                              ? 'status-processing'
                              : 'status-pending'
                          }`}></span>
                          {selectedMedicine.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="info-group">
                      <label className="info-label">
                        <i className="fas fa-comment-medical me-2 text-primary"></i>Hướng dẫn sử dụng:
                      </label>
                      <div className="info-value bg-light p-3 rounded">
                        {selectedMedicine.instructions || selectedMedicine.specialInstructions || 'Không có hướng dẫn đặc biệt'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="info-group">
                      <label className="info-label">
                        <i className="fas fa-sticky-note me-2 text-warning"></i>Ghi chú phụ huynh:
                      </label>
                      <div className="info-value bg-light p-3 rounded">
                        {selectedMedicine.parents_Note || selectedMedicine.specialInstructions || 'Không có ghi chú thêm'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseDetails}>
                    <i className="fas fa-times me-2"></i>Đóng
                  </button>
                  {(selectedMedicine.status !== 'Đã phát' && selectedMedicine.status !== 'Đã gửi') && (
                    <button type="button" className="btn btn-success">
                      <i className="fas fa-check me-2"></i>Đánh dấu đã phát
                    </button>
                  )}
                  <button type="button" className="btn btn-primary">
                    <i className="fas fa-print me-2"></i>In đơn thuốc
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}        {/* Individual Medicine Form Modal */}
        {showForm && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-plus-circle me-2"></i>Tạo đơn thuốc mới
                  </h5>
                  <button type="button" className="btn-close" onClick={handleCancelForm}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmitForm} className="individual-form">
                    {/* Thông tin học sinh */}
                    <div className="form-section mb-4">
                      <h6 className="form-section-title">
                        <i className="fas fa-user-graduate me-2"></i>Thông tin học sinh
                      </h6>
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label htmlFor="patientId" className="form-label">
                            <i className="fas fa-id-card me-2"></i>Mã học sinh
                          </label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="patientId" 
                            value={formData.patientId}
                            onChange={handleInputChange}
                            placeholder="Nhập mã học sinh"
                            required 
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="patientName" className="form-label">
                            <i className="fas fa-user me-2"></i>Họ tên học sinh
                          </label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="patientName" 
                            value={formData.patientName}
                            onChange={handleInputChange}
                            placeholder="Nhập họ tên học sinh"
                            required 
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="class" className="form-label">
                            <i className="fas fa-school me-2"></i>Lớp học
                          </label>
                          <select 
                            className="form-select" 
                            id="class" 
                            value={formData.class}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Chọn lớp</option>
                            <option value="6A">6A</option>
                            <option value="6B">6B</option>
                            <option value="6C">6C</option>
                            <option value="7A">7A</option>
                            <option value="7B">7B</option>
                            <option value="7C">7C</option>
                            <option value="8A">8A</option>
                            <option value="8B">8B</option>
                            <option value="8C">8C</option>
                            <option value="9A">9A</option>
                            <option value="9B">9B</option>
                            <option value="9C">9C</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Thông tin thuốc */}
                    <div className="form-section mb-4">
                      <h6 className="form-section-title">
                        <i className="fas fa-pills me-2"></i>Thông tin thuốc
                      </h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="medication_Name" className="form-label">
                            <i className="fas fa-prescription-bottle me-2"></i>Tên thuốc
                          </label>
                          <select 
                            className="form-select" 
                            id="medication_Name" 
                            value={formData.medication_Name}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Chọn loại thuốc</option>
                            <option value="Paracetamol">Paracetamol (Hạ sốt, giảm đau)</option>
                            <option value="Vitamin C">Vitamin C (Bổ sung vitamin)</option>
                            <option value="Amoxicillin">Amoxicillin (Kháng sinh)</option>
                            <option value="Cetirizine">Cetirizine (Chống dị ứng)</option>
                            <option value="Ibuprofen">Ibuprofen (Chống viêm, giảm đau)</option>
                            <option value="Aspirin">Aspirin (Giảm đau, hạ sốt)</option>
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="dosage" className="form-label">
                            <i className="fas fa-balance-scale me-2"></i>Liều lượng
                          </label>
                          <select 
                            className="form-select" 
                            id="dosage" 
                            value={formData.dosage}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Chọn liều lượng</option>
                            <option value="250mg">250mg</option>
                            <option value="500mg">500mg</option>
                            <option value="1000mg">1000mg</option>
                            <option value="10mg">10mg</option>
                            <option value="20mg">20mg</option>
                            <option value="400mg">400mg</option>
                            <option value="1 viên">1 viên</option>
                            <option value="2 viên">2 viên</option>
                            <option value="1/2 viên">1/2 viên</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hướng dẫn sử dụng */}
                    <div className="form-section mb-4">
                      <h6 className="form-section-title">
                        <i className="fas fa-clock me-2"></i>Hướng dẫn sử dụng
                      </h6>
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label htmlFor="consumption_Time" className="form-label">
                            <i className="fas fa-redo me-2"></i>Tần suất sử dụng
                          </label>
                          <select 
                            className="form-select" 
                            id="consumption_Time" 
                            value={formData.consumption_Time}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Chọn tần suất</option>
                            <option value="Ngày 1 lần">Ngày 1 lần</option>
                            <option value="Ngày 2 lần">Ngày 2 lần</option>
                            <option value="Ngày 3 lần">Ngày 3 lần</option>
                            <option value="Ngày 4 lần">Ngày 4 lần</option>
                            <option value="Sáng 1 lần">Sáng 1 lần</option>
                            <option value="Chiều 1 lần">Chiều 1 lần</option>
                            <option value="Tối 1 lần">Tối 1 lần</option>
                            <option value="Khi cần">Khi cần</option>
                          </select>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="startDate" className="form-label">
                            <i className="fas fa-calendar-alt me-2"></i>Ngày bắt đầu
                          </label>
                          <input 
                            type="date" 
                            className="form-control" 
                            id="startDate" 
                            value={formData.startDate}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="endDate" className="form-label">
                            <i className="fas fa-calendar-check me-2"></i>Ngày kết thúc
                          </label>
                          <input 
                            type="date" 
                            className="form-control" 
                            id="endDate" 
                            value={formData.endDate}
                            onChange={handleInputChange}
                            min={formData.startDate}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Thông tin bổ sung */}
                    <div className="form-section mb-4">
                      <h6 className="form-section-title">
                        <i className="fas fa-info-circle me-2"></i>Thông tin bổ sung
                      </h6>
                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <label htmlFor="instructions" className="form-label">
                            <i className="fas fa-file-medical me-2"></i>Hướng dẫn chi tiết
                          </label>
                          <textarea 
                            className="form-control" 
                            id="instructions" 
                            rows="3"
                            value={formData.instructions}
                            onChange={handleInputChange}
                            placeholder="Nhập hướng dẫn chi tiết về cách sử dụng thuốc (uống trước/sau ăn, lưu ý đặc biệt...)"
                          ></textarea>
                        </div>
                        <div className="col-md-12 mb-3">
                          <label htmlFor="parents_Note" className="form-label">
                            <i className="fas fa-sticky-note me-2"></i>Ghi chú phụ huynh
                          </label>
                          <textarea 
                            className="form-control" 
                            id="parents_Note" 
                            rows="2"
                            value={formData.parents_Note}
                            onChange={handleInputChange}
                            placeholder="Ghi chú thêm từ phụ huynh (tình trạng sức khỏe đặc biệt, dị ứng...)"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <div className="alert alert-warning">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        <strong>Lưu ý:</strong> Vui lòng kiểm tra kỹ thông tin trước khi gửi. 
                        Nhà trường sẽ xem xét và phê duyệt đơn thuốc trong vòng 24h.
                      </div>
                    </div>
                    
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleCancelForm}>
                        <i className="fas fa-times me-2"></i>Hủy bỏ
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>Gửi đơn thuốc
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}
        
        {/* Floating Action Button for Quick Actions */}
        <div className="fab-container">
          <button className="fab" onClick={handleNewMedicine} title="Tạo đơn thuốc mới">
            <i className="fas fa-plus"></i>
          </button>
        </div>

        <ErrorDialog open={showError} message={error} onClose={() => setShowError(false)} />
      </div>
    </div>
  );
};

export default SendMedicine;
