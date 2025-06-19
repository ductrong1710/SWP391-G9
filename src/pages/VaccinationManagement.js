import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './VaccinationManagement.css';

const VaccinationManagement = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [vaccinations, setVaccinations] = useState([]);  const [loading, setLoading] = useState(true);
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState('individual');
  
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    class: '',
    vaccineType: '',
    dateScheduled: new Date().toISOString().split('T')[0],
    location: 'Phòng Y tế Trường',
    notes: ''
  });

  // State cho các bộ lọc
  const [filters, setFilters] = useState({
    grade: '',
    className: '',
    status: ''
  });

  // State cho danh sách lớp đã chọn để đặt lịch hàng loạt
  const defaultBatchFormData = {
    className: '',
    vaccineType: '',
    dateScheduled: new Date().toISOString().split('T')[0],
    location: 'Phòng Y tế Trường',
    notes: ''
  };
  const [batchFormData, setBatchFormData] = useState(defaultBatchFormData);
  
  // State cho học sinh trong lớp (sử dụng cho đặt lịch hàng loạt)
  const [classStudents, setClassStudents] = useState([]);
    // State để theo dõi các học sinh được chọn trong lịch hàng loạt
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Mock data for vaccinations
  const mockVaccinations = useMemo(() => [
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      patientId: 'SV2022001',
      class: '12A1',
      vaccineType: 'Vắc-xin COVID-19',
      dateScheduled: '2025-06-25',
      status: 'Đã lên lịch',
      location: 'Phòng Y tế Trường',
      notes: 'Học sinh có tiền sử dị ứng nhẹ với vắc-xin.'
    },
    {
      id: 2,
      patientName: 'Trần Thị B',
      patientId: 'SV2022045',
      class: '11A2',
      vaccineType: 'Vắc-xin cúm mùa',
      dateScheduled: '2025-07-10',
      status: 'Đã lên lịch',
      location: 'Phòng Y tế Trường',
      notes: 'Tiêm phòng cúm định kỳ hàng năm.'
    },
    {
      id: 3,
      patientName: 'Lê Minh C',
      patientId: 'SV2022078',
      class: '10A3',
      vaccineType: 'Vắc-xin viêm gan B',
      dateScheduled: '2025-06-05',
      status: 'Đã tiêm',
      location: 'Phòng Y tế Trường',
      notes: 'Liều đầu tiên trong loạt ba liều.'
    },
    {
      id: 4,
      patientName: 'Phạm Thị D',
      patientId: 'SV2022012',
      class: '10A1',
      vaccineType: 'Vắc-xin uốn ván',
      dateScheduled: '2025-05-20',
      status: 'Đã tiêm',
      location: 'Phòng Y tế Trường',
      notes: 'Tiêm nhắc định kỳ 10 năm.'
    },
    {
      id: 5,
      patientName: 'Hoàng Văn E',
      patientId: 'SV2022034',
      class: '10A1',      vaccineType: 'Vắc-xin sởi-quai bị-rubella (MMR)',
      dateScheduled: '2025-06-15',
      status: 'Đã lên lịch',
      location: 'Phòng Y tế Trường',
      notes: 'Tiêm nhắc lại.'
    }
  ], []);

  // Mock data for class students
  const mockClassStudents = {
    '10A1': [
      { id: 'SV2022012', name: 'Phạm Thị D' },
      { id: 'SV2022034', name: 'Hoàng Văn E' },
      { id: 'SV2022056', name: 'Nguyễn Thị F' },
      { id: 'SV2022078', name: 'Đỗ Văn M' },
      { id: 'SV2022090', name: 'Trần Thị N' },
    ],
    '10A2': [
      { id: 'SV2022013', name: 'Lê Văn P' },
      { id: 'SV2022035', name: 'Nguyễn Thị Q' },
      { id: 'SV2022057', name: 'Hoàng Văn R' },
      { id: 'SV2022079', name: 'Phạm Thị S' },
      { id: 'SV2022091', name: 'Vũ Văn T' },
    ],
    '11A1': [
      { id: 'SV2022067', name: 'Vũ Văn G' },
      { id: 'SV2022023', name: 'Trần Thị H' },
      { id: 'SV2022015', name: 'Hoàng Văn Z' },
      { id: 'SV2022037', name: 'Nguyễn Thị AA' },
      { id: 'SV2022059', name: 'Lê Văn BB' },
    ]
  };

  // Kiểm tra xác thực
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: { pathname: '/vaccination-management' },
          manualLogin: true 
        } 
      });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      setVaccinations(mockVaccinations);
      setLoading(false);
    }, 1000);  }, [mockVaccinations]);

  // Handler for new vaccination (individual)
  // eslint-disable-next-line no-unused-vars
  const handleNewVaccination = () => {
    setActiveTab('individual');
    setShowForm(true);
  };

  // Lọc vaccinations
  const getFilteredVaccinations = () => {
    return vaccinations.filter(vaccination => {
      // Lọc theo khối (ví dụ: '10', '11', '12')
      if (filters.grade && !vaccination.class.startsWith(filters.grade)) {
        return false;
      }
      
      // Lọc theo lớp cụ thể
      if (filters.className && vaccination.class !== filters.className) {
        return false;
      }
      
      // Lọc theo trạng thái
      if (filters.status && vaccination.status !== filters.status) {
        return false;
      }
      
      return true;
    });
  };

  // Handlers
  const handleViewDetails = (vaccination) => {
    setSelectedVaccination(vaccination);
  };

  const handleCloseDetails = () => {
    setSelectedVaccination(null);
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
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    // Trong ứng dụng thực tế, gửi dữ liệu đến API
    // Hiện tại, chỉ đóng form
    setShowForm(false);
    alert('Đã lên lịch tiêm chủng thành công!');
  };

  const handleBatchSchedule = () => {
    setClassStudents([]);
    setSelectedStudents([]);
    setBatchFormData(defaultBatchFormData);
    setShowBatchForm(true);
  };

  const handleCancelBatchForm = () => {
    setShowBatchForm(false);
  };

  const handleBatchInputChange = (e) => {
    const { id, value } = e.target;
    setBatchFormData(prev => ({
      ...prev,
      [id]: value
    }));

    // Nếu thay đổi lớp, tải danh sách học sinh
    if (id === 'className' && value) {
      setClassStudents(mockClassStudents[value] || []);
      setSelectedStudents([]);
    }
  };

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === classStudents.length) {
      // Nếu đã chọn tất cả, bỏ chọn tất cả
      setSelectedStudents([]);
    } else {
      // Nếu chưa chọn tất cả, chọn tất cả
      setSelectedStudents(classStudents.map(student => student.id));
    }
  };

  const handleSelectStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    } else {
      setSelectedStudents(prev => [...prev, studentId]);
    }
  };

  const handleSubmitBatchForm = (e) => {
    e.preventDefault();
    if (selectedStudents.length === 0) {
      alert('Vui lòng chọn ít nhất một học sinh để lên lịch tiêm chủng!');
      return;
    }
    // Trong ứng dụng thực tế, gửi dữ liệu đến API
    // Hiện tại, chỉ đóng form
    setShowBatchForm(false);
    alert(`Đã lên lịch tiêm chủng cho ${selectedStudents.length} học sinh lớp ${batchFormData.className}!`);
  };

  const handleApplyFilters = () => {
    setVaccinations(getFilteredVaccinations());
  };

  const handleResetFilters = () => {
    setFilters({
      grade: '',
      className: '',
      status: ''
    });
    setVaccinations(mockVaccinations);
  };

  const handleExportToExcel = () => {
    alert('Tính năng xuất Excel đang được phát triển!');
  };

  const handleImportFromExcel = () => {
    alert('Tính năng nhập từ Excel đang được phát triển!');
  };

  return (
    <div className="vaccination-management-container">
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Quản lý tiêm chủng học đường</h1>
          <div>
            <button className="btn btn-success me-2" onClick={handleBatchSchedule}>
              <i className="fas fa-users me-2"></i>Tạo lịch tiêm theo lớp
            </button>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <i className="fas fa-plus-circle me-2"></i>Tạo lịch tiêm cá nhân
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card health-stat-card">
              <div className="card-body">
                <h5 className="card-title">Tổng số học sinh</h5>
                <p className="card-number">{vaccinations.length}</p>
                <p className="card-text">Đã đăng ký tiêm</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card health-stat-card">
              <div className="card-body">
                <h5 className="card-title">Đã tiêm</h5>
                <p className="card-number">{vaccinations.filter(v => v.status === 'Đã tiêm').length}</p>
                <p className="card-text">Học sinh</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card health-stat-card">
              <div className="card-body">
                <h5 className="card-title">Chờ tiêm</h5>
                <p className="card-number">{vaccinations.filter(v => v.status === 'Đã lên lịch').length}</p>
                <p className="card-text">Học sinh</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card health-stat-card">
              <div className="card-body">
                <h5 className="card-title">Đợt tiêm</h5>
                <p className="card-number">02</p>
                <p className="card-text">Học kỳ 2, 2024-2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Card */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Lọc danh sách tiêm chủng</h5>
            <div className="row">
              <div className="col-md-3 mb-2">
                <select 
                  id="grade" 
                  className="form-select"
                  value={filters.grade}
                  onChange={(e) => setFilters({...filters, grade: e.target.value})}
                >
                  <option value="">Chọn khối</option>
                  <option value="10">Khối 10</option>
                  <option value="11">Khối 11</option>
                  <option value="12">Khối 12</option>
                </select>
              </div>
              <div className="col-md-3 mb-2">
                <select 
                  id="className" 
                  className="form-select"
                  value={filters.className}
                  onChange={(e) => setFilters({...filters, className: e.target.value})}
                >
                  <option value="">Chọn lớp</option>
                  <option value="10A1">10A1</option>
                  <option value="10A2">10A2</option>
                  <option value="10A3">10A3</option>
                  <option value="11A1">11A1</option>
                  <option value="11A2">11A2</option>
                  <option value="12A1">12A1</option>
                  <option value="12A2">12A2</option>
                </select>
              </div>
              <div className="col-md-3 mb-2">
                <select 
                  id="status" 
                  className="form-select"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">Trạng thái</option>
                  <option value="Đã lên lịch">Chờ tiêm</option>
                  <option value="Đã tiêm">Đã tiêm</option>
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

        {/* Export/Import Buttons */}
        <div className="d-flex justify-content-end mb-3 btn-export-import">
          <button className="btn btn-outline-success me-2" onClick={handleExportToExcel}>
            <i className="fas fa-file-excel me-2"></i>Xuất Excel
          </button>
          <button className="btn btn-outline-primary" onClick={handleImportFromExcel}>
            <i className="fas fa-file-import me-2"></i>Nhập danh sách
          </button>
        </div>

        {/* Main Table */}
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3">Đang tải dữ liệu tiêm chủng...</p>
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Mã học sinh</th>
                      <th>Họ tên</th>
                      <th>Lớp</th>
                      <th>Loại vắc-xin</th>
                      <th>Ngày tiêm</th>
                      <th>Địa điểm</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vaccinations.length > 0 ? (
                      vaccinations.map((vaccination) => (
                        <tr key={vaccination.id}>
                          <td>{vaccination.id}</td>
                          <td>{vaccination.patientId}</td>
                          <td>{vaccination.patientName}</td>
                          <td>{vaccination.class}</td>
                          <td>{vaccination.vaccineType}</td>
                          <td>{vaccination.dateScheduled}</td>
                          <td>{vaccination.location}</td>
                          <td>
                            <span className={`badge ${
                              vaccination.status === 'Đã tiêm' 
                                ? 'bg-success' 
                                : 'bg-primary'
                            }`}>
                              {vaccination.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-info me-2"
                              onClick={() => handleViewDetails(vaccination)}
                            >
                              <i className="fas fa-eye me-1"></i>Xem
                            </button>
                            <button className="btn btn-sm btn-secondary">
                              <i className="fas fa-edit me-1"></i>Sửa
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center py-3">
                          <p className="mb-0 text-muted">Không có dữ liệu tiêm chủng nào phù hợp với điều kiện lọc</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Vaccination Details Modal */}
        {selectedVaccination && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Chi tiết lịch tiêm chủng</h5>
                  <button type="button" className="btn-close" onClick={handleCloseDetails}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <strong>Mã học sinh:</strong> {selectedVaccination.patientId}
                  </div>
                  <div className="mb-3">
                    <strong>Họ tên:</strong> {selectedVaccination.patientName}
                  </div>
                  <div className="mb-3">
                    <strong>Lớp:</strong> {selectedVaccination.class}
                  </div>
                  <div className="mb-3">
                    <strong>Loại vắc-xin:</strong> {selectedVaccination.vaccineType}
                  </div>
                  <div className="mb-3">
                    <strong>Ngày tiêm:</strong> {selectedVaccination.dateScheduled}
                  </div>
                  <div className="mb-3">
                    <strong>Địa điểm:</strong> {selectedVaccination.location}
                  </div>
                  <div className="mb-3">
                    <strong>Trạng thái:</strong> <span className={`badge ${
                      selectedVaccination.status === 'Đã tiêm' 
                        ? 'bg-success' 
                        : 'bg-primary'
                    }`}>{selectedVaccination.status}</span>
                  </div>
                  <div className="mb-3">
                    <strong>Ghi chú:</strong> {selectedVaccination.notes}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseDetails}>Đóng</button>
                  {selectedVaccination.status !== 'Đã tiêm' && (
                    <button type="button" className="btn btn-primary">Đánh dấu đã tiêm</button>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}

        {/* Individual Vaccination Form Modal */}
        {showForm && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Tạo lịch tiêm chủng mới</h5>
                  <button type="button" className="btn-close" onClick={handleCancelForm}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmitForm} className="individual-form">
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label htmlFor="patientId" className="form-label">Mã học sinh</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="patientId" 
                          value={formData.patientId}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="patientName" className="form-label">Họ tên học sinh</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="patientName" 
                          value={formData.patientName}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="class" className="form-label">Lớp</label>
                        <select 
                          className="form-select" 
                          id="class" 
                          value={formData.class}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Chọn lớp</option>
                          <option value="10A1">10A1</option>
                          <option value="10A2">10A2</option>
                          <option value="10A3">10A3</option>
                          <option value="11A1">11A1</option>
                          <option value="11A2">11A2</option>
                          <option value="12A1">12A1</option>
                          <option value="12A2">12A2</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="vaccineType" className="form-label">Loại vắc-xin</label>
                        <select 
                          className="form-select" 
                          id="vaccineType" 
                          value={formData.vaccineType}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Chọn loại vắc-xin</option>
                          <option value="Vắc-xin COVID-19">Vắc-xin COVID-19</option>
                          <option value="Vắc-xin cúm mùa">Vắc-xin cúm mùa</option>
                          <option value="Vắc-xin viêm gan B">Vắc-xin viêm gan B</option>
                          <option value="Vắc-xin uốn ván">Vắc-xin uốn ván</option>
                          <option value="Vắc-xin sởi-quai bị-rubella (MMR)">Vắc-xin sởi-quai bị-rubella (MMR)</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="dateScheduled" className="form-label">Ngày tiêm</label>
                        <input 
                          type="date" 
                          className="form-control" 
                          id="dateScheduled" 
                          value={formData.dateScheduled}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="location" className="form-label">Địa điểm tiêm</label>
                        <select 
                          className="form-select" 
                          id="location" 
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="Phòng Y tế Trường">Phòng Y tế Trường</option>
                          <option value="Trung tâm Y tế Quận">Trung tâm Y tế Quận</option>
                          <option value="Bệnh viện Đa khoa Tỉnh">Bệnh viện Đa khoa Tỉnh</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="notes" className="form-label">Ghi chú</label>
                        <textarea 
                          className="form-control" 
                          id="notes" 
                          rows="2"
                          value={formData.notes}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleCancelForm}>Hủy</button>
                      <button type="submit" className="btn btn-primary">Lưu lịch tiêm</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}

        {/* Batch Vaccination Form Modal */}
        {showBatchForm && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Tạo lịch tiêm chủng theo lớp</h5>
                  <button type="button" className="btn-close" onClick={handleCancelBatchForm}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmitBatchForm} className="batch-form">
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label htmlFor="className" className="form-label">Chọn lớp</label>
                        <select 
                          className="form-select" 
                          id="className" 
                          value={batchFormData.className}
                          onChange={handleBatchInputChange}
                          required
                        >
                          <option value="">Chọn lớp</option>
                          <option value="10A1">10A1</option>
                          <option value="10A2">10A2</option>
                          <option value="11A1">11A1</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="vaccineType" className="form-label">Loại vắc-xin</label>
                        <select 
                          className="form-select" 
                          id="vaccineType" 
                          value={batchFormData.vaccineType}
                          onChange={handleBatchInputChange}
                          required
                        >
                          <option value="">Chọn loại vắc-xin</option>
                          <option value="Vắc-xin COVID-19">Vắc-xin COVID-19</option>
                          <option value="Vắc-xin cúm mùa">Vắc-xin cúm mùa</option>
                          <option value="Vắc-xin viêm gan B">Vắc-xin viêm gan B</option>
                          <option value="Vắc-xin uốn ván">Vắc-xin uốn ván</option>
                          <option value="Vắc-xin sởi-quai bị-rubella (MMR)">Vắc-xin sởi-quai bị-rubella (MMR)</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="dateScheduled" className="form-label">Ngày tiêm</label>
                        <input 
                          type="date" 
                          className="form-control" 
                          id="dateScheduled" 
                          value={batchFormData.dateScheduled}
                          onChange={handleBatchInputChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="location" className="form-label">Địa điểm tiêm</label>
                        <select 
                          className="form-select" 
                          id="location" 
                          value={batchFormData.location}
                          onChange={handleBatchInputChange}
                          required
                        >
                          <option value="Phòng Y tế Trường">Phòng Y tế Trường</option>
                          <option value="Trung tâm Y tế Quận">Trung tâm Y tế Quận</option>
                          <option value="Bệnh viện Đa khoa Tỉnh">Bệnh viện Đa khoa Tỉnh</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="notes" className="form-label">Ghi chú</label>
                        <textarea 
                          className="form-control" 
                          id="notes" 
                          rows="2"
                          value={batchFormData.notes}
                          onChange={handleBatchInputChange}
                        ></textarea>
                      </div>
                    </div>

                    {classStudents.length > 0 && (
                      <div className="student-selection mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="mb-0">Danh sách học sinh</h6>
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="selectAll" 
                              checked={selectedStudents.length === classStudents.length}
                              onChange={handleSelectAllStudents}
                            />
                            <label className="form-check-label" htmlFor="selectAll">
                              Chọn tất cả
                            </label>
                          </div>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered">
                            <thead>
                              <tr>
                                <th style={{ width: '50px' }}></th>
                                <th>Mã học sinh</th>
                                <th>Họ tên</th>
                              </tr>
                            </thead>
                            <tbody>
                              {classStudents.map(student => (
                                <tr key={student.id}>
                                  <td className="text-center">
                                    <input 
                                      type="checkbox" 
                                      className="form-check-input" 
                                      checked={selectedStudents.includes(student.id)}
                                      onChange={() => handleSelectStudent(student.id)}
                                    />
                                  </td>
                                  <td>{student.id}</td>
                                  <td>{student.name}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleCancelBatchForm}>Hủy</button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={!batchFormData.className || classStudents.length === 0 || selectedStudents.length === 0}
                      >
                        Lưu lịch tiêm
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaccinationManagement;
