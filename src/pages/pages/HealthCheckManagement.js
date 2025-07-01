import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HealthCheckManagement.css';
import apiClient from '../services/apiClient';
import { getApprovedStudents, getResultByConsent } from '../services/healthCheckService';

const HealthCheckManagement = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [healthChecks, setHealthChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHealthCheck, setSelectedHealthCheck] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [editingHealthCheckId, setEditingHealthCheckId] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    checkupDate: new Date().toISOString().split('T')[0],
    checkupType: '',
    doctorName: '',
    healthFacility: 'Phòng Y tế Trường',
    notes: '',
    status: 'Đã lên lịch',
    NeedToContactParent: false,
    followUpDate: ''
  });
  
  // Thêm state cho các bộ lọc
  const [filters, setFilters] = useState({
    grade: '',
    className: '',
    status: ''
  });
    // State cho danh sách lớp đã chọn để đặt lịch hàng loạt
  const defaultBatchFormData = {
    className: '',
    checkupDate: new Date().toISOString().split('T')[0],
    checkupType: 'Khám sức khỏe định kỳ', 
    doctorName: '',
    healthFacility: 'Phòng Y tế Trường',
    notes: ''
  };
  const [batchFormData, setBatchFormData] = useState(defaultBatchFormData);
  
  // Thêm state cho học sinh trong lớp (sử dụng cho đặt lịch hàng loạt)
  const [classStudents, setClassStudents] = useState([]);
  
  // State để theo dõi các học sinh được chọn trong lịch hàng loạt
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // Thêm state cho planId thực tế
  const [planId, setPlanId] = useState('');
  
  // Thêm state cho danh sách lớp có thể chọn
  const [availableClasses, setAvailableClasses] = useState([]);
  
  useEffect(() => {
    // Kiểm tra xác thực
    if (!authLoading && !isAuthenticated) {
      console.log("HealthCheckManagement: Not authenticated, redirecting to login");
      navigate('/login', { 
        state: { 
          from: { pathname: '/health-check-management' },
          manualLogin: true 
        } 
      });
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.grade) params.append('grade', filters.grade);
        if (filters.className) params.append('className', filters.className);
        if (filters.status) params.append('status', filters.status);
        
        // Gọi API backend lấy health checks với các tham số lọc
        const response = await apiClient.get(`/api/HealthCheckResult?${params.toString()}`);
        setHealthChecks(response.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu khám sức khỏe:", error);
        // Có thể set state lỗi để hiển thị thông báo cho người dùng
        setHealthChecks([]); // Đảm bảo không còn mock data khi lỗi
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]); // Chạy lại khi filters thay đổi

  const handleViewDetails = (healthCheck) => {
    setSelectedHealthCheck(healthCheck);
  };

  const handleCloseDetails = () => {
    setSelectedHealthCheck(null);
  };
  
  const handleNewHealthCheck = () => {
    setEditingHealthCheckId(null);
    setFormData({
      studentId: '',
      checkupDate: new Date().toISOString().split('T')[0],
      checkupType: '',
      doctorName: '',
      healthFacility: 'Phòng Y tế Trường',
      notes: '',
      status: 'Đã lên lịch',
      NeedToContactParent: false,
      followUpDate: ''
    });
    setShowForm(true);
  };

  const handleEditHealthCheck = (healthCheck) => {
    setEditingHealthCheckId(healthCheck.id);
    setFormData({
      studentId: healthCheck.studentId,
      checkupDate: healthCheck.date,
      checkupType: healthCheck.checkupType,
      doctorName: healthCheck.doctorName,
      healthFacility: healthCheck.healthFacility,
      notes: healthCheck.results,
      status: healthCheck.status,
      NeedToContactParent: healthCheck.NeedToContactParent || false,
      followUpDate: healthCheck.followUpDate || ''
    });
    setShowForm(true);
  };

  const handleUpdateResult = (healthCheck) => {
    handleCloseDetails();
    handleEditHealthCheck(healthCheck);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingHealthCheckId(null);
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => {
      const newState = { ...prev, [id]: type === 'checkbox' ? checked : value };
      
      if (id === 'status') {
        if (value === 'Đã hủy') {
          newState.checkupDate = '';
        }
        if (value !== 'Đang theo dõi') {
          newState.followUpDate = '';
        }
      }
      
      return newState;
    });
  };

  const handleSendNotification = (studentName, parentId) => {
    if (!parentId) {
      console.warn(`Không tìm thấy thông tin phụ huynh của học sinh ${studentName}. Không thể gửi thông báo.`);
      alert(`Lỗi: Không tìm thấy thông tin phụ huynh của học sinh ${studentName} để gửi thông báo.`);
      return;
    }
    
    const message = `Kính gửi phụ huynh học sinh ${studentName},\n\nNhà trường cần trao đổi về kết quả kiểm tra sức khỏe gần đây của em. Vui lòng đăng nhập vào hệ thống hoặc liên hệ với phòng y tế để biết thêm chi tiết.\n\nTrân trọng,\nPhòng Y tế`;
    
    // Giả lập gửi thông báo
    console.log(`--- GỬI THÔNG BÁO TỚI TÀI KHOẢN PHỤ HUYNH (ID: ${parentId}) ---`);
    console.log(message);
    console.log(`-------------------------------------------------`);
    
    alert(`Đã gửi thông báo đến tài khoản phụ huynh (ID: ${parentId}).`);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const dataToSend = {
      studentId: formData.studentId,
      checkupDate: new Date(formData.checkupDate).toISOString().split('T')[0],
      doctorName: formData.doctorName,
      healthFacility: formData.healthFacility,
      checkupType: formData.checkupType,
      status: "Đã lên lịch",
      notes: formData.notes
    };
    try {
      await apiClient.post('/api/HealthCheckResult', dataToSend);
      alert('Đã lên lịch khám sức khỏe thành công!');
      setShowForm(false);
      setEditingHealthCheckId(null);
      setFilters(currentFilters => ({...currentFilters}));
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };
  
  // Hàm xử lý lọc
  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleApplyFilters = () => {
    // useEffect sẽ tự động cập nhật dựa trên state filters,
    // nhưng ta có thể gọi fetchData() ở đây nếu muốn có nút "Lọc" rõ ràng
    // Tuy nhiên, với cấu trúc hiện tại, việc thay đổi filter đã tự động fetch lại
    console.log("Applied filters:", filters);
  };
  
  const handleResetFilters = () => {
    setFilters({
      grade: '',
      className: '',
      status: ''
    });
    setBatchFormData({
      ...defaultBatchFormData,
      checkupDate: new Date().toISOString().split('T')[0], // Luôn lấy ngày hiện tại
    });
    
    setSelectedStudents([]);
    setClassStudents([]); // Reset danh sách học sinh
    
    // Delay một chút để đảm bảo modal được hiển thị sau khi state được cập nhật
    setTimeout(() => {
      setShowBatchForm(true);
      console.log("Batch form should be visible now");
      
      // Focus vào dropdown lớp học khi form được hiển thị
      setTimeout(() => {
        const classNameSelect = document.getElementById('className');
        if (classNameSelect) {
          classNameSelect.focus();
        }
      }, 100);
    }, 0);
  };
  
  // Xử lý tạo lịch khám hàng loạt
  const handleBatchSchedule = () => {
    console.log("Opening batch schedule form");
    
    // Đảm bảo reset form với giá trị mặc định
    setBatchFormData({
      ...defaultBatchFormData,
      checkupDate: new Date().toISOString().split('T')[0], // Luôn lấy ngày hiện tại
    });
    
    setSelectedStudents([]);
    setClassStudents([]); // Reset danh sách học sinh
    
    // Delay một chút để đảm bảo modal được hiển thị sau khi state được cập nhật
    setTimeout(() => {
      setShowBatchForm(true);
      console.log("Batch form should be visible now");
      
      // Focus vào dropdown lớp học khi form được hiển thị
      setTimeout(() => {
        const classNameSelect = document.getElementById('className');
        if (classNameSelect) {
          classNameSelect.focus();
        }
      }, 100);
    }, 0);
  };
  
  const handleCancelBatchForm = () => {
    setShowBatchForm(false);
  };
    const handleBatchInputChange = async (e) => {
    const { id, value } = e.target;
    console.log(`Batch input changed: ${id} = ${value}`);
    
    setBatchFormData(prev => {
      const newData = {
        ...prev,
        [id]: value
      };
      console.log("Updated batch form data:", newData);
      return newData;
    });
    
    if (id === 'className' && value) {
      try {
        console.log(`Loading students for class ${value}`);
        const response = await apiClient.get(`/api/SchoolClass/${value}/students`);
        const students = response.data;
        console.log(`Found ${students.length} students for class ${value}:`, students);
        setClassStudents(students);
        setSelectedStudents([]);
      } catch (error) {
        console.error(`Lỗi khi tải danh sách học sinh cho lớp ${value}:`, error);
        setClassStudents([]);
        setSelectedStudents([]);
      }
    }
  };
  
  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };
  
  const handleSelectAllStudents = () => {
    if (selectedStudents.length === classStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(classStudents.map(student => student.UserID));
    }
  };
  
  // Hàm gửi thông báo cho phụ huynh dựa vào StudentID
  const notifyParent = async (studentId, checkupDate) => {
    if (!studentId) {
      console.warn("studentId bị undefined, bỏ qua gửi thông báo.");
      return;
    }
    try {
      console.log("Gửi thông báo cho studentId:", studentId);
      // Lấy Health_Record để lấy ParentID
      const healthRecordRes = await apiClient.get(`/api/HealthRecord/student/${studentId}`);
      const healthRecord = healthRecordRes.data;
      if (!healthRecord || !healthRecord.parentID) {
        console.warn(`Không tìm thấy ParentID cho học sinh ${studentId}`);
        return;
      }
      // Gửi notification
      await apiClient.post('/api/Notification', {
        userId: healthRecord.parentID,
        title: 'Thông báo lịch khám sức khỏe',
        message: `Học sinh có mã ${studentId} đã được lên lịch khám sức khỏe vào ngày ${checkupDate}. Vui lòng kiểm tra lịch trên hệ thống.`
      });
      console.log(`Đã gửi thông báo cho phụ huynh ${healthRecord.parentID}`);
    } catch (error) {
      console.error('Lỗi khi gửi thông báo cho phụ huynh:', error);
    }
  };
  
  const handleSubmitBatchForm = async (e) => {
    e.preventDefault();
    console.log("Batch form submitted with data:", batchFormData, "Selected students:", selectedStudents);
    if (selectedStudents.length === 0) {
      alert('Vui lòng chọn ít nhất một học sinh!');
      return;
    }
    const batchData = {
      ...batchFormData,
      studentIds: selectedStudents
    };
    try {
      await apiClient.post('/api/HealthCheckResult/batch', batchData);
      // Gửi thông báo song song cho tất cả phụ huynh liên quan (lọc studentId hợp lệ)
      await Promise.all(
        selectedStudents
          .filter(studentId => !!studentId)
          .map(studentId => notifyParent(studentId, batchFormData.checkupDate))
      );
      setFilters(currentFilters => ({...currentFilters}));
      setShowBatchForm(false);
      alert(`Đã lên lịch khám sức khỏe cho ${selectedStudents.length} học sinh!`);
    } catch (error) {
      console.error("Lỗi khi tạo lịch khám hàng loạt:", error);
      alert('Đã xảy ra lỗi khi tạo lịch khám hàng loạt. Vui lòng thử lại.');
    }
  };    // Hàm xử lý xuất file Excel
  const handleExportToExcel = () => {
    // Trong thực tế, bạn sẽ sử dụng thư viện như XLSX hoặc ExcelJS để xuất Excel
    console.log("Exporting health checks to Excel...");
    
    // Giả lập xuất Excel
    const today = new Date().toLocaleDateString('vi-VN');
    alert(`Đã xuất danh sách khám sức khỏe ${healthChecks.length} học sinh thành công! (demo_export_${today}.xlsx)`);
  };
  
  // Hàm xử lý nhập danh sách từ file Excel
  const handleImportFromExcel = () => {
    // Trong thực tế, bạn sẽ mở file picker và xử lý file Excel
    console.log("Importing student list from Excel...");
    
    // Giả lập nhập Excel
    alert('Tính năng nhập danh sách từ Excel đang được phát triển!');
  };
  
  // Sử dụng useEffect để fix dropdown bằng Javascript trực tiếp khi modal hiển thị
  useEffect(() => {
    if (showBatchForm) {
      console.log('Attempting to fix form elements');
      // Sử dụng setTimeout để đảm bảo DOM đã được render
      setTimeout(() => {
        // Fix các dropdown
        const selects = document.querySelectorAll('.modal .form-select');
        selects.forEach(select => {
          select.style.backgroundColor = 'white';
          select.style.color = '#212529';
          select.style.cursor = 'pointer';
          select.style.pointerEvents = 'auto';
          select.style.opacity = '1';
          
          // Tạo event click trực tiếp
          select.onclick = function(e) {
            console.log('Select clicked:', e.target.id);
          }
        });
        
        // Fix các input
        const inputs = document.querySelectorAll('.modal input');
        inputs.forEach(input => {
          input.style.backgroundColor = 'white';
          input.style.color = '#212529';
          input.style.pointerEvents = 'auto';
          input.style.opacity = '1';
        });
        
        console.log('Form elements should be fixed now');
      }, 300);
    }
  }, [showBatchForm]);
  
  // Khi mở modal batch schedule, gọi API lấy danh sách lớp:
  useEffect(() => {
    if (showBatchForm) {
      apiClient.get('/api/SchoolClass')
        .then(res => setAvailableClasses(res.data))
        .catch(() => setAvailableClasses([]));
    }
  }, [showBatchForm]);
  
  console.log('classStudents:', classStudents);
  
  return (
    <div className="health-check-management-container">
      <div className="container py-4">        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Khám sức khỏe định kỳ</h1>
          <div>
            <button className="btn btn-success me-2" onClick={handleBatchSchedule}>
              <i className="fas fa-users me-2"></i>Tạo lịch theo lớp
            </button>
            <button className="btn btn-primary" onClick={handleNewHealthCheck}>
              <i className="fas fa-plus-circle me-2"></i>Tạo lịch cá nhân
            </button>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card health-stat-card">
              <div className="card-body">
                <h5 className="card-title">Tổng số học sinh</h5>
                <p className="card-number">{healthChecks.length}</p>
                <p className="card-text">Đã đăng ký khám</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card health-stat-card">
              <div className="card-body">
                <h5 className="card-title">Đã khám</h5>
                <p className="card-number">{healthChecks.filter(check => check.status === 'Hoàn thành').length}</p>
                <p className="card-text">Học sinh</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card health-stat-card">
              <div className="card-body">
                <h5 className="card-title">Chờ khám</h5>
                <p className="card-number">{healthChecks.filter(check => check.status === 'Đã lên lịch').length}</p>
                <p className="card-text">Học sinh</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card health-stat-card">
              <div className="card-body">
                <h5 className="card-title">Đợt khám</h5>
                <p className="card-number">02</p>
                <p className="card-text">Học kỳ 2, 2024-2025</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Lọc danh sách học sinh</h5>
            <div className="row">
              <div className="col-md-3 mb-2">
                <select 
                  id="grade" 
                  className="form-select"
                  value={filters.grade ?? ""}
                  onChange={handleFilterChange}
                >
                  <option key="empty" value="">Chọn khối</option>
                  <option key="10" value="10">Khối 10</option>
                  <option key="11" value="11">Khối 11</option>
                  <option key="12" value="12">Khối 12</option>
                </select>
              </div>
              <div className="col-md-3 mb-2">
                <select 
                  id="className" 
                  className="form-select"
                  value={filters.className ?? ""}
                  onChange={handleFilterChange}
                >
                  <option key="empty" value="">Chọn lớp</option>
                  <option key="10A1" value="10A1">10A1</option>
                  <option key="10A2" value="10A2">10A2</option>
                  <option key="10A3" value="10A3">10A3</option>
                  <option key="11A1" value="11A1">11A1</option>
                  <option key="11A2" value="11A2">11A2</option>
                  <option key="12A1" value="12A1">12A1</option>
                  <option key="12A2" value="12A2">12A2</option>
                </select>
              </div>
              <div className="col-md-3 mb-2">
                <select 
                  id="status" 
                  className="form-select"
                  value={filters.status ?? ""}
                  onChange={handleFilterChange}
                >
                  <option key="empty" value="">Trạng thái</option>
                  <option key="Hoàn thành" value="Hoàn thành">Đã khám</option>
                  <option key="Đã lên lịch" value="Đã lên lịch">Chờ khám</option>
                  <option key="Đang chờ kết quả" value="Đang chờ kết quả">Chờ kết quả</option>
                  <option key="Đang theo dõi" value="Đang theo dõi">Đang theo dõi</option>
                  <option key="Đã hủy" value="Đã hủy">Đã hủy</option>
                </select>
              </div>
              <div className="col-md-3 mb-2">
                <div className="d-flex">
                  <button className="btn btn-primary flex-grow-1 me-2" onClick={handleApplyFilters}>
                    <i className="fas fa-search me-2"></i>Lọc
                  </button>
                  <button className="btn btn-secondary" onClick={handleResetFilters}>
                    <i className="fas fa-redo"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mb-3 btn-export-import">
          <button className="btn btn-outline-success me-2" onClick={handleExportToExcel}>
            <i className="fas fa-file-excel me-2"></i>Xuất Excel
          </button>
          <button className="btn btn-outline-primary" onClick={handleImportFromExcel}>
            <i className="fas fa-file-import me-2"></i>Nhập danh sách
          </button>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3">Đang tải dữ liệu khám sức khỏe...</p>
          </div>
        ) : (          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Mã học sinh</th>
                      <th>Họ tên</th>
                      <th>Lớp</th>
                      <th>Ngày khám</th>
                      <th>Loại khám</th>
                      <th>Bác sĩ</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {healthChecks.length > 0 ? (
                      healthChecks.map((healthCheck, idx) => (
                        <tr key={healthCheck.id || `healthcheck-row-${idx}`}>
                          <td>{healthCheck.id}</td>
                          <td>{healthCheck.studentId}</td>
                          <td>{healthCheck.patientName}</td>
                          <td>{healthCheck.class}</td>
                          <td>{healthCheck.date}</td>
                          <td>{healthCheck.checkupType}</td>
                          <td>{healthCheck.doctorName}</td>
                          <td>
                            <span className={`badge ${
                              healthCheck.status === 'Hoàn thành' 
                                ? 'bg-success' 
                                : healthCheck.status === 'Đang chờ kết quả' 
                                  ? 'bg-warning' 
                                  : healthCheck.status === 'Đã hủy'
                                    ? 'bg-danger'
                                    : healthCheck.status === 'Đang theo dõi'
                                      ? 'bg-info'
                                      : 'bg-primary'
                            }`}>
                              {healthCheck.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-info me-2"
                              onClick={() => handleViewDetails(healthCheck)}
                            >
                              <i className="fas fa-eye me-1"></i>Xem
                            </button>
                            {healthCheck.status !== 'Hoàn thành' && healthCheck.status !== 'Đã hủy' && (
                              <button 
                                className="btn btn-sm btn-secondary"
                                onClick={() => handleEditHealthCheck(healthCheck)}
                              >
                                <i className="fas fa-edit me-1"></i>Sửa
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center py-3">
                          <p className="mb-0 text-muted">Không có dữ liệu khám sức khỏe nào phù hợp với điều kiện lọc</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}        {/* Chi tiết lịch khám sức khỏe */}
        {selectedHealthCheck && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Chi tiết khám sức khỏe học đường</h5>
                  <button type="button" className="btn-close" onClick={handleCloseDetails}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <strong>Mã học sinh:</strong> {selectedHealthCheck.studentId}
                  </div>
                  <div className="mb-3">
                    <strong>Họ tên:</strong> {selectedHealthCheck.patientName}
                  </div>
                  <div className="mb-3">
                    <strong>Lớp:</strong> {selectedHealthCheck.class}
                  </div>
                  <div className="mb-3">
                    <strong>Ngày khám:</strong> {selectedHealthCheck.date}
                  </div>
                  <div className="mb-3">
                    <strong>Loại khám:</strong> {selectedHealthCheck.checkupType}
                  </div>
                  <div className="mb-3">
                    <strong>Bác sĩ:</strong> {selectedHealthCheck.doctorName}
                  </div>
                  <div className="mb-3">
                    <strong>Cơ sở y tế:</strong> {selectedHealthCheck.healthFacility || 'Phòng Y tế Trường'}
                  </div>
                  <div className="mb-3">
                    <strong>Trạng thái:</strong> <span className={`badge ${
                      selectedHealthCheck.status === 'Hoàn thành' 
                        ? 'bg-success' 
                        : selectedHealthCheck.status === 'Đang chờ kết quả' 
                          ? 'bg-warning' 
                          : selectedHealthCheck.status === 'Đã hủy'
                            ? 'bg-danger'
                            : selectedHealthCheck.status === 'Đang theo dõi'
                              ? 'bg-info'
                              : 'bg-primary'
                    }`}>{selectedHealthCheck.status}</span>
                  </div>
                  <div className="mb-3">
                    <strong>Kết quả:</strong> {selectedHealthCheck.results}
                  </div>
                  {selectedHealthCheck.followUpDate && (
                    <div className="mb-3">
                      <strong>Ngày tái khám:</strong> {selectedHealthCheck.followUpDate}
                    </div>
                  )}
                  {selectedHealthCheck.NeedToContactParent && (
                    <div className="alert alert-warning mt-3">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Cần liên hệ với phụ huynh.
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseDetails}>Đóng</button>
                  {selectedHealthCheck.status !== 'Hoàn thành' && selectedHealthCheck.status !== 'Đã hủy' && (
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={() => handleUpdateResult(selectedHealthCheck)}
                    >
                      Cập nhật kết quả
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}        {/* Form tạo lịch khám sức khỏe mới */}        {showForm && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingHealthCheckId ? 'Cập nhật thông tin khám sức khỏe' : 'Tạo lịch khám sức khỏe học đường mới'}</h5>
                  <button type="button" className="btn-close" onClick={handleCancelForm}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmitForm} className="individual-form">
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label htmlFor="studentId" className="form-label">Mã học sinh</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="studentId" 
                          value={formData.studentId ?? ""}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="checkupDate" className="form-label">Ngày khám</label>
                        <input 
                          type="date" 
                          className="form-control" 
                          id="checkupDate" 
                          value={formData.checkupDate ?? ""}
                          onChange={handleInputChange}
                          min={!editingHealthCheckId ? new Date().toISOString().split('T')[0] : undefined}
                          required={formData.status !== 'Đã hủy'}
                          disabled={formData.status === 'Đã hủy'}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="checkupType" className="form-label">Loại khám</label>
                        <select 
                          className="form-select" 
                          id="checkupType" 
                          value={formData.checkupType ?? ""}
                          onChange={handleInputChange}
                          required
                        >
                          <option key="empty" value="">Chọn loại khám</option>
                          <option key="Khám sức khỏe định kỳ" value="Khám sức khỏe định kỳ">Khám sức khỏe định kỳ</option>
                          <option key="Khám mắt" value="Khám mắt">Khám mắt</option>
                          <option key="Khám răng" value="Khám răng">Khám răng</option>
                          <option key="Khám tai mũi họng" value="Khám tai mũi họng">Khám tai mũi họng</option>
                          <option key="Sàng lọc cong vẹo cột sống" value="Sàng lọc cong vẹo cột sống">Sàng lọc cong vẹo cột sống</option>
                          <option key="Đo chiều cao cân nặng" value="Đo chiều cao cân nặng">Đo chiều cao cân nặng</option>
                          <option key="Xét nghiệm máu" value="Xét nghiệm máu">Xét nghiệm máu</option>
                        </select>
                      </div>
                    </div>
                    
                    {editingHealthCheckId && (
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="doctorName" className="form-label">Bác sĩ khám</label>
                          <select 
                            className="form-select" 
                            id="doctorName" 
                            value={formData.doctorName ?? ""}
                            onChange={handleInputChange}
                            required
                          >
                            <option key="empty" value="">Chọn bác sĩ</option>
                            <option key="BS. Trần Thị Hương" value="BS. Trần Thị Hương">BS. Trần Thị Hương</option>
                            <option key="BS. Phạm Văn Minh" value="BS. Phạm Văn Minh">BS. Phạm Văn Minh</option>
                            <option key="BS. Nguyễn Thị Lan" value="BS. Nguyễn Thị Lan">BS. Nguyễn Thị Lan</option>
                            <option key="BS. Lê Thành Nam" value="BS. Lê Thành Nam">BS. Lê Thành Nam</option>
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="healthFacility" className="form-label">Cơ sở y tế</label>
                          <select 
                            className="form-select" 
                            id="healthFacility" 
                            value={formData.healthFacility ?? ""}
                            onChange={handleInputChange}
                            required
                          >
                            <option key="empty" value="">Chọn cơ sở y tế</option>
                            <option key="Phòng Y tế Trường" value="Phòng Y tế Trường">Phòng Y tế Trường</option>
                            <option key="Trạm Y tế Phường" value="Trạm Y tế Phường">Trạm Y tế Phường</option>
                            <option key="Bệnh viện Đa khoa Quận" value="Bệnh viện Đa khoa Quận">Bệnh viện Đa khoa Quận</option>
                            <option key="Bệnh viện Đa khoa Tỉnh" value="Bệnh viện Đa khoa Tỉnh">Bệnh viện Đa khoa Tỉnh</option>
                          </select>
                        </div>
                      </div>
                    )}
                    
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        {formData.status === 'Đang theo dõi' && (
                          <div className="mb-3">
                            <label htmlFor="followUpDate" className="form-label">Ngày tái khám</label>
                            <input 
                              type="date" 
                              className="form-control" 
                              id="followUpDate" 
                              value={formData.followUpDate ?? ""}
                              onChange={handleInputChange}
                              min={new Date().toISOString().split('T')[0]}
                              required
                            />
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        {editingHealthCheckId && formData.checkupType === 'Khám sức khỏe định kỳ' && (
                          <div className="form-check mb-3">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="NeedToContactParent"
                              checked={formData.NeedToContactParent}
                              onChange={handleInputChange}
                            />
                            <label className="form-check-label" htmlFor="NeedToContactParent">
                              Cần liên hệ phụ huynh
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="notes" className="form-label">{editingHealthCheckId ? 'Kết quả' : 'Ghi chú (không bắt buộc)'}</label>
                      <textarea 
                        className="form-control" 
                        id="notes" 
                        rows="3"
                        value={formData.notes ?? ""}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      Vui lòng kiểm tra thông tin trước khi xác nhận lịch khám sức khỏe. Học sinh cần được thông báo về lịch khám trước ít nhất 3 ngày.
                    </div>
                    
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleCancelForm}>Hủy bỏ</button>
                      <button type="submit" className="btn btn-primary">
                        <i className="fas fa-calendar-check me-2"></i>{editingHealthCheckId ? 'Cập nhật' : 'Xác nhận lịch khám'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}        {/* Form tạo lịch khám sức khỏe hàng loạt */}
        {showBatchForm && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Tạo lịch khám sức khỏe theo lớp</h5>
                  <button type="button" className="btn-close" onClick={handleCancelBatchForm}></button>
                </div>
                <div className="modal-body">
                  {/* Hiển thị thông báo lỗi nếu không có học sinh */}
                  {classStudents.length === 0 && batchFormData.className && (
                    <div className="alert alert-danger">
                      Không thể tải danh sách học sinh hoặc không có học sinh trong lớp này.
                    </div>
                  )}
                  <form onSubmit={handleSubmitBatchForm} className="batch-form">
                    <div className="row mb-3">                      <div className="col-md-6">
                        <label htmlFor="className" className="form-label">Chọn lớp</label>
                        <div className="custom-select-wrapper">
                          <select
                            className="form-select"
                            id="className"
                            value={batchFormData.className}
                            onChange={e => handleBatchInputChange({ target: { id: 'className', value: e.target.value } })}
                            required
                          >
                            <option key="empty" value="">Chọn lớp</option>
                            {availableClasses.map((cls, idx) => (
                              <option key={cls.ClassID || cls.classID || `class-option-${idx}`} value={cls.ClassID || cls.classID}>
                                {cls.ClassName || cls.className || `Lớp ${idx+1}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>                      <div className="col-md-6">
                        <label htmlFor="checkupDate" className="form-label">Ngày khám</label>
                        <input 
                          type="date" 
                          className="form-control" 
                          id="checkupDate" 
                          defaultValue={new Date().toISOString().split('T')[0]}
                          onChange={(e) => {
                            console.log('Date selected:', e.target.value);
                            handleBatchInputChange({
                              target: {
                                id: 'checkupDate',
                                value: e.target.value
                              }
                            });
                          }}
                          min={new Date().toISOString().split('T')[0]}
                          required 
                        />
                      </div>
                    </div>
                      <div className="row mb-3">                      <div className="col-md-6">
                        <label htmlFor="checkupType" className="form-label">Loại khám</label>
                        <div className="custom-select-wrapper">
                          <select 
                            className="form-select" 
                            id="checkupType" 
                            defaultValue="Khám sức khỏe định kỳ"
                            onChange={(e) => {
                              console.log('Checkup type selected:', e.target.value);
                              handleBatchInputChange({
                                target: {
                                  id: 'checkupType',
                                  value: e.target.value
                                }
                              });
                            }}
                            required
                          >
                            <option key="empty" value="">Chọn loại khám</option>
                            <option key="Khám sức khỏe định kỳ" value="Khám sức khỏe định kỳ">Khám sức khỏe định kỳ</option>
                            <option key="Khám mắt" value="Khám mắt">Khám mắt</option>
                            <option key="Khám răng" value="Khám răng">Khám răng</option>
                            <option key="Khám tai mũi họng" value="Khám tai mũi họng">Khám tai mũi họng</option>
                            <option key="Sàng lọc cong vẹo cột sống" value="Sàng lọc cong vẹo cột sống">Sàng lọc cong vẹo cột sống</option>
                            <option key="Đo chiều cao cân nặng" value="Đo chiều cao cân nặng">Đo chiều cao cân nặng</option>
                            <option key="Xét nghiệm máu" value="Xét nghiệm máu">Xét nghiệm máu</option>
                          </select>
                        </div>
                      </div>                      <div className="col-md-6">
                        <label htmlFor="notes" className="form-label">Ghi chú (không bắt buộc)</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="notes" 
                          onChange={(e) => {
                            console.log('Notes updated:', e.target.value);
                            handleBatchInputChange({
                              target: {
                                id: 'notes',
                                value: e.target.value
                              }
                            });
                          }}
                        />
                      </div>
                    </div>
                      <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">Danh sách học sinh</h5>
                        {classStudents.length > 0 && (
                          <button 
                            type="button" 
                            className="btn btn-outline-primary btn-sm"
                            onClick={handleSelectAllStudents}
                          >
                            {selectedStudents.length === classStudents.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                          </button>
                        )}
                      </div>
                      
                      {batchFormData.className ? (
                        <div id="studentListContainer" className="student-list-container">
                          {classStudents.length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-sm table-hover">
                                <thead>
                                  <tr>
                                    <th style={{width: '50px'}}></th>
                                    <th>Mã học sinh</th>
                                    <th>Họ tên</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {classStudents.map((student, idx) => (
                                    <tr key={student.UserID || `student-row-${idx}`}>
                                      <td>
                                        <div className="form-check">
                                          <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id={`student-${student.UserID || idx}`}
                                            checked={selectedStudents.includes(student.UserID)}
                                            onChange={() => handleStudentSelection(student.UserID)}
                                            style={{cursor: 'pointer'}}
                                          />
                                          <label 
                                            htmlFor={`student-${student.UserID || idx}`} 
                                            style={{display: 'none'}}
                                          ></label>
                                        </div>
                                      </td>
                                      <td>{student.UserID}</td>
                                      <td>{student.Name || student.name}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="alert alert-info">
                              Không có học sinh nào trong lớp này.
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="alert alert-warning">
                          Vui lòng chọn lớp để xem danh sách học sinh.
                        </div>
                      )}
                    </div>
                    
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      Đã chọn {selectedStudents.length} học sinh để đặt lịch khám. Vui lòng kiểm tra thông tin trước khi xác nhận.
                    </div><div className="modal-footer">
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={handleCancelBatchForm} 
                      >
                        Hủy bỏ
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={selectedStudents.length === 0}
                      >
                        <i className="fas fa-calendar-check me-2"></i>Xác nhận lịch khám cho {selectedStudents.length} học sinh
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {healthChecks.length === 0 && !loading && (
          <div className="alert alert-info">
            <i className="fas fa-info-circle me-2"></i>
            Không tìm thấy kết quả nào phù hợp với điều kiện lọc. Vui lòng thử lại với điều kiện khác hoặc 
            <button 
              className="btn btn-link p-0 mx-1 align-baseline" 
              style={{fontSize: 'inherit', verticalAlign: 'baseline'}}
              onClick={handleResetFilters}
            >
              xóa bộ lọc
            </button>.
          </div>
        )}
      </div>
    </div>
  );
};

function ApprovedStudentsList({ planId }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getApprovedStudents(planId);
      const data = await Promise.all(res.data.map(async (consent) => {
        const resultRes = await getResultByConsent(consent.id);
        return {
          ...consent,
          resultStatus: resultRes.data?.resultStatus || 'Đang chờ kết quả'
        };
      }));
      setStudents(data);
    };
    if (planId) fetchData();
  }, [planId]);

  return (
    <table>
      <thead>
        <tr>
          <th>Học sinh</th>
          <th>Trạng thái kết quả</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s, idx) => (
          <tr key={s.id || `approved-student-row-${idx}`}>
            <td>{s.student?.name}</td>
            <td>
              {s.resultStatus === 'Completed' && <span style={{color: 'green'}}>Hoàn thành</span>}
              {s.resultStatus === 'FollowUp' && <span style={{color: 'orange'}}>Theo dõi sau khi khám</span>}
              {s.resultStatus === 'Đang chờ kết quả' && <span style={{color: 'gray'}}>Đang chờ kết quả</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default HealthCheckManagement;
