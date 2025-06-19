import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HealthCheckManagement.css';

const HealthCheckManagement = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [healthChecks, setHealthChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHealthCheck, setSelectedHealthCheck] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    class: '',
    checkupDate: new Date().toISOString().split('T')[0],
    checkupType: '',
    doctorName: '',
    healthFacility: 'Phòng Y tế Trường',
    notes: ''
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
    // Sử dụng useMemo để tránh tạo lại mockHealthChecks mỗi khi component render
  const mockHealthChecks = useMemo(() => [
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      patientId: 'SV2022001',
      class: '12A1',
      date: '2025-05-15',
      checkupType: 'Khám sức khỏe định kỳ',
      doctorName: 'BS. Trần Thị Hương',
      healthFacility: 'Phòng Y tế Trường',
      status: 'Hoàn thành',
      results: 'Huyết áp bình thường, chỉ số BMI khỏe mạnh, mức cholesterol bình thường.'
    },
    {
      id: 2,
      patientName: 'Lê Thị B',
      patientId: 'SV2022045',
      class: '11A2',
      date: '2025-06-10',
      checkupType: 'Xét nghiệm máu',
      doctorName: 'BS. Phạm Văn Minh',
      healthFacility: 'Phòng Y tế Trường',
      status: 'Đang chờ kết quả',
      results: 'Đang chờ kết quả từ phòng xét nghiệm.'
    },
    {
      id: 3,
      patientName: 'Trần Văn C',
      patientId: 'SV2022078',
      class: '10A3',
      date: '2025-06-20',
      checkupType: 'Kiểm tra tim mạch',
      doctorName: 'BS. Nguyễn Thị Lan',
      healthFacility: 'Bệnh viện Đa khoa Tỉnh',
      status: 'Đã lên lịch',
      results: 'Chưa có kết quả.'
    },
    {
      id: 4,
      patientName: 'Phạm Thị D',
      patientId: 'SV2022012',
      class: '10A1',
      date: '2025-05-18',
      checkupType: 'Khám sức khỏe định kỳ',
      doctorName: 'BS. Trần Thị Hương',
      healthFacility: 'Phòng Y tế Trường',
      status: 'Hoàn thành',
      results: 'Sức khỏe tốt, cần bổ sung vitamin D.'
    },
    {
      id: 5,
      patientName: 'Hoàng Văn E',
      patientId: 'SV2022034',
      class: '10A1',
      date: '2025-05-18',
      checkupType: 'Khám sức khỏe định kỳ',
      doctorName: 'BS. Trần Thị Hương',
      healthFacility: 'Phòng Y tế Trường',
      status: 'Hoàn thành',
      results: 'Cần điều chỉnh chế độ ăn uống, tăng cường tập thể dục.'
    },
    {
      id: 6,
      patientName: 'Nguyễn Thị F',
      patientId: 'SV2022056',
      class: '10A1',
      date: '2025-05-25',
      checkupType: 'Khám răng',
      doctorName: 'BS. Lê Thành Nam',
      healthFacility: 'Phòng Y tế Trường',
      status: 'Đã lên lịch',
      results: 'Chưa có kết quả.'
    },
    {
      id: 7,
      patientName: 'Vũ Văn G',
      patientId: 'SV2022067',
      class: '11A1',
      date: '2025-06-05',
      checkupType: 'Khám mắt',
      doctorName: 'BS. Nguyễn Thị Lan',
      healthFacility: 'Bệnh viện Đa khoa Quận',
      status: 'Đã lên lịch',
      results: 'Chưa có kết quả.'
    },
    {
      id: 8,
      patientName: 'Trần Thị H',
      patientId: 'SV2022023',
      class: '11A1',
      date: '2025-06-05',
      checkupType: 'Khám mắt',
      doctorName: 'BS. Nguyễn Thị Lan',
      healthFacility: 'Bệnh viện Đa khoa Quận',
      status: 'Đã lên lịch',
      results: 'Chưa có kết quả.'
    },
    {
      id: 9,
      patientName: 'Lê Văn I',
      patientId: 'SV2022089',
      class: '12A2',
      date: '2025-05-10',
      checkupType: 'Khám sức khỏe định kỳ',
      doctorName: 'BS. Phạm Văn Minh',
      healthFacility: 'Phòng Y tế Trường',
      status: 'Hoàn thành',
      results: 'Sức khỏe tốt, không có vấn đề đáng lưu ý.'
    },
    {
      id: 10,
      patientName: 'Nguyễn Thị K',
      patientId: 'SV2022098',
      class: '12A2',
      date: '2025-05-10',
      checkupType: 'Khám sức khỏe định kỳ',
      doctorName: 'BS. Phạm Văn Minh',
      healthFacility: 'Phòng Y tế Trường',
      status: 'Hoàn thành',
      results: 'Sức khỏe tốt, khuyến nghị tăng cường vitamin C.'
    }
  ], []);
  
  // Dữ liệu mẫu cho danh sách học sinh theo lớp
  const mockClassStudents = useMemo(() => {
    return {
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
      '10A3': [
        { id: 'SV2022078', name: 'Trần Văn C' },
        { id: 'SV2022014', name: 'Nguyễn Thị U' },
        { id: 'SV2022036', name: 'Phạm Văn V' },
        { id: 'SV2022058', name: 'Lê Thị X' },
        { id: 'SV2022080', name: 'Trần Văn Y' },
      ],
      '11A1': [
        { id: 'SV2022067', name: 'Vũ Văn G' },
        { id: 'SV2022023', name: 'Trần Thị H' },
        { id: 'SV2022015', name: 'Hoàng Văn Z' },
        { id: 'SV2022037', name: 'Nguyễn Thị AA' },
        { id: 'SV2022059', name: 'Lê Văn BB' },
      ],
      '11A2': [
        { id: 'SV2022045', name: 'Lê Thị B' },
        { id: 'SV2022016', name: 'Phạm Thị CC' },
        { id: 'SV2022038', name: 'Trần Văn DD' },
        { id: 'SV2022060', name: 'Nguyễn Thị EE' },
        { id: 'SV2022082', name: 'Hoàng Văn FF' },
      ],
      '12A1': [
        { id: 'SV2022001', name: 'Nguyễn Văn A' },
        { id: 'SV2022017', name: 'Lê Văn GG' },
        { id: 'SV2022039', name: 'Phạm Thị HH' },
        { id: 'SV2022061', name: 'Trần Văn II' },
        { id: 'SV2022083', name: 'Nguyễn Thị JJ' },
      ],
      '12A2': [
        { id: 'SV2022089', name: 'Lê Văn I' },
        { id: 'SV2022098', name: 'Nguyễn Thị K' },
        { id: 'SV2022018', name: 'Hoàng Văn KK' },
        { id: 'SV2022040', name: 'Trần Thị LL' },
        { id: 'SV2022062', name: 'Nguyễn Văn MM' },
      ]
    };
  }, []);  useEffect(() => {
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
    // Trong ứng dụng thực tế, lấy dữ liệu từ API
    // Hiện tại, sử dụng dữ liệu mẫu
    setTimeout(() => {
      setHealthChecks(mockHealthChecks);
      setLoading(false);
    }, 1000);
  }, [mockHealthChecks]);

  // Thêm useEffect để xử lý lọc
  useEffect(() => {
    if (filters.className || filters.grade || filters.status) {
      console.log("Applying filters:", filters);
      // Trong thực tế, bạn sẽ gọi API với các tham số lọc này
      // Ở đây chúng ta sẽ lọc mockHealthChecks
      const filteredData = mockHealthChecks.filter(item => {
        // Lọc theo khối (ví dụ: '10', '11', '12')
        if (filters.grade && !item.class.startsWith(filters.grade)) {
          return false;
        }
        
        // Lọc theo lớp cụ thể
        if (filters.className && item.class !== filters.className) {
          return false;
        }
        
        // Lọc theo trạng thái
        if (filters.status && item.status !== filters.status) {
          return false;
        }
        
        return true;
      });
      
      setHealthChecks(filteredData);
    } else {
      // Nếu không có bộ lọc nào, hiển thị tất cả
      setHealthChecks(mockHealthChecks);
    }
  }, [filters, mockHealthChecks]);
  const handleViewDetails = (healthCheck) => {
    setSelectedHealthCheck(healthCheck);
  };

  const handleCloseDetails = () => {
    setSelectedHealthCheck(null);
  };
  
  const handleNewHealthCheck = () => {
    setFormData({
      patientName: '',
      patientId: '',
      class: '',
      checkupDate: new Date().toISOString().split('T')[0],
      checkupType: '',
      doctorName: '',
      healthFacility: 'Phòng Y tế Trường',
      notes: ''
    });
    setShowForm(true);
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
    console.log("Form submitted with data:", formData);
    
    // Tạo bản ghi mới với ID tự động tăng
    const newHealthCheck = {
      id: healthChecks.length + 1,
      patientName: formData.patientName,
      patientId: formData.patientId,
      class: formData.class,
      date: formData.checkupDate,
      checkupType: formData.checkupType,
      doctorName: formData.doctorName,
      healthFacility: formData.healthFacility,
      status: 'Đã lên lịch',
      results: 'Chưa có kết quả.'
    };
    
    // Thêm vào danh sách hiện tại
    setHealthChecks(prevChecks => [...prevChecks, newHealthCheck]);
    
    // Đóng form
    setShowForm(false);
    alert('Đã lên lịch khám sức khỏe thành công!');
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
    // Không cần làm gì vì useEffect sẽ tự động cập nhật dựa trên state filters
    console.log("Applied filters:", filters);
  };
  
  const handleResetFilters = () => {
    setFilters({
      grade: '',
      className: '',
      status: ''
    });
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
    const handleBatchInputChange = (e) => {
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
    
    // Nếu lớp thay đổi, cập nhật danh sách học sinh
    if (id === 'className' && value) {
      console.log(`Loading students for class ${value}`);
      const students = mockClassStudents[value] || [];
      console.log(`Found ${students.length} students for class ${value}:`, students);
      setClassStudents(students);
      setSelectedStudents([]); // Reset selected students when class changes
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
      setSelectedStudents(classStudents.map(student => student.id));
    }
  };
  
  const handleSubmitBatchForm = (e) => {
    e.preventDefault();
    console.log("Batch form submitted with data:", batchFormData, "Selected students:", selectedStudents);
    
    if (selectedStudents.length === 0) {
      alert('Vui lòng chọn ít nhất một học sinh!');
      return;
    }
    
    // Tạo các bản ghi mới cho mỗi học sinh được chọn
    const newHealthChecks = selectedStudents.map((studentId, index) => {
      const student = classStudents.find(s => s.id === studentId);
      return {
        id: healthChecks.length + index + 1,
        patientName: student.name,
        patientId: student.id,
        class: batchFormData.className,
        date: batchFormData.checkupDate,
        checkupType: batchFormData.checkupType,
        doctorName: batchFormData.doctorName,
        healthFacility: batchFormData.healthFacility,
        status: 'Đã lên lịch',
        results: 'Chưa có kết quả.'
      };
    });
    
    // Thêm vào danh sách hiện tại
    setHealthChecks(prevChecks => [...prevChecks, ...newHealthChecks]);
    
    // Đóng form
    setShowBatchForm(false);
    alert(`Đã lên lịch khám sức khỏe cho ${selectedStudents.length} học sinh!`);
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
                  value={filters.grade}
                  onChange={handleFilterChange}
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
                  onChange={handleFilterChange}
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
                  onChange={handleFilterChange}
                >
                  <option value="">Trạng thái</option>
                  <option value="Hoàn thành">Đã khám</option>
                  <option value="Đã lên lịch">Chờ khám</option>
                  <option value="Đang chờ kết quả">Chờ kết quả</option>
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
                      healthChecks.map((healthCheck) => (
                        <tr key={healthCheck.id}>
                          <td>{healthCheck.id}</td>
                          <td>{healthCheck.patientId}</td>
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
                            <button className="btn btn-sm btn-secondary">
                              <i className="fas fa-edit me-1"></i>Sửa
                            </button>
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
                    <strong>Mã học sinh:</strong> {selectedHealthCheck.patientId}
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
                          : 'bg-primary'
                    }`}>{selectedHealthCheck.status}</span>
                  </div>
                  <div className="mb-3">
                    <strong>Kết quả:</strong> {selectedHealthCheck.results}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseDetails}>Đóng</button>
                  {selectedHealthCheck.status !== 'Hoàn thành' && (
                    <button type="button" className="btn btn-primary">Cập nhật kết quả</button>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}        {/* Form tạo lịch khám sức khỏe mới */}        {showForm && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Tạo lịch khám sức khỏe học đường mới</h5>
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
                        <input 
                          type="text" 
                          className="form-control" 
                          id="class" 
                          value={formData.class}
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
                          value={formData.checkupDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          required 
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="checkupType" className="form-label">Loại khám</label>
                        <select 
                          className="form-select" 
                          id="checkupType" 
                          value={formData.checkupType}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Chọn loại khám</option>
                          <option value="Khám sức khỏe định kỳ">Khám sức khỏe định kỳ</option>
                          <option value="Khám mắt">Khám mắt</option>
                          <option value="Khám răng">Khám răng</option>
                          <option value="Khám tai mũi họng">Khám tai mũi họng</option>
                          <option value="Sàng lọc cong vẹo cột sống">Sàng lọc cong vẹo cột sống</option>
                          <option value="Đo chiều cao cân nặng">Đo chiều cao cân nặng</option>
                          <option value="Xét nghiệm máu">Xét nghiệm máu</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="doctorName" className="form-label">Bác sĩ khám</label>
                        <select 
                          className="form-select" 
                          id="doctorName" 
                          value={formData.doctorName}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Chọn bác sĩ</option>
                          <option value="BS. Trần Thị Hương">BS. Trần Thị Hương</option>
                          <option value="BS. Phạm Văn Minh">BS. Phạm Văn Minh</option>
                          <option value="BS. Nguyễn Thị Lan">BS. Nguyễn Thị Lan</option>
                          <option value="BS. Lê Thành Nam">BS. Lê Thành Nam</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="healthFacility" className="form-label">Cơ sở y tế</label>
                        <select 
                          className="form-select" 
                          id="healthFacility" 
                          value={formData.healthFacility}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="Phòng Y tế Trường">Phòng Y tế Trường</option>
                          <option value="Trạm Y tế Phường">Trạm Y tế Phường</option>
                          <option value="Bệnh viện Đa khoa Quận">Bệnh viện Đa khoa Quận</option>
                          <option value="Bệnh viện Đa khoa Tỉnh">Bệnh viện Đa khoa Tỉnh</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="notes" className="form-label">Ghi chú (không bắt buộc)</label>
                      <textarea 
                        className="form-control" 
                        id="notes" 
                        rows="3"
                        value={formData.notes}
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
                        <i className="fas fa-calendar-check me-2"></i>Xác nhận lịch khám
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
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
                  <form onSubmit={handleSubmitBatchForm} className="batch-form">
                    <div className="row mb-3">                      <div className="col-md-6">
                        <label htmlFor="className" className="form-label">Chọn lớp</label>
                        <div className="custom-select-wrapper">
                          <select 
                            className="form-select" 
                            id="className" 
                            onChange={(e) => {
                              console.log('Class selected:', e.target.value);
                              handleBatchInputChange({
                                target: {
                                  id: 'className',
                                  value: e.target.value
                                }
                              });
                            }}
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
                            <option value="Khám sức khỏe định kỳ">Khám sức khỏe định kỳ</option>
                            <option value="Khám mắt">Khám mắt</option>
                            <option value="Khám răng">Khám răng</option>
                            <option value="Khám tai mũi họng">Khám tai mũi họng</option>
                            <option value="Sàng lọc cong vẹo cột sống">Sàng lọc cong vẹo cột sống</option>
                            <option value="Đo chiều cao cân nặng">Đo chiều cao cân nặng</option>
                            <option value="Xét nghiệm máu">Xét nghiệm máu</option>
                          </select>
                        </div>
                      </div>                      <div className="col-md-6">
                        <label htmlFor="doctorName" className="form-label">Bác sĩ khám</label>
                        <div className="custom-select-wrapper">
                          <select 
                            className="form-select" 
                            id="doctorName" 
                            onChange={(e) => {
                              console.log('Doctor selected:', e.target.value);
                              handleBatchInputChange({
                                target: {
                                  id: 'doctorName',
                                  value: e.target.value
                                }
                              });
                            }}
                            required
                          >
                            <option value="">Chọn bác sĩ</option>
                            <option value="BS. Trần Thị Hương">BS. Trần Thị Hương</option>
                            <option value="BS. Phạm Văn Minh">BS. Phạm Văn Minh</option>
                            <option value="BS. Nguyễn Thị Lan">BS. Nguyễn Thị Lan</option>
                            <option value="BS. Lê Thành Nam">BS. Lê Thành Nam</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="row mb-3">                      <div className="col-md-6">
                        <label htmlFor="healthFacility" className="form-label">Cơ sở y tế</label>
                        <div className="custom-select-wrapper">
                          <select 
                            className="form-select" 
                            id="healthFacility" 
                            defaultValue="Phòng Y tế Trường"
                            onChange={(e) => {
                              console.log('Facility selected:', e.target.value);
                              handleBatchInputChange({
                                target: {
                                  id: 'healthFacility',
                                  value: e.target.value
                                }
                              });
                            }}
                            required
                          >
                            <option value="Phòng Y tế Trường">Phòng Y tế Trường</option>
                            <option value="Trạm Y tế Phường">Trạm Y tế Phường</option>
                            <option value="Bệnh viện Đa khoa Quận">Bệnh viện Đa khoa Quận</option>
                            <option value="Bệnh viện Đa khoa Tỉnh">Bệnh viện Đa khoa Tỉnh</option>
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
                                  {classStudents.map((student) => (
                                    <tr key={student.id}>
                                      <td>
                                        <div className="form-check">
                                          <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id={`student-${student.id}`}
                                            onChange={() => {
                                              console.log('Student selected:', student.id);
                                              handleStudentSelection(student.id);
                                            }}
                                            style={{cursor: 'pointer'}}
                                          />
                                          <label 
                                            htmlFor={`student-${student.id}`} 
                                            style={{display: 'none'}}
                                          ></label>
                                        </div>
                                      </td>
                                      <td>{student.id}</td>
                                      <td>{student.name}</td>
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
            <div className="modal-backdrop fade show"></div>
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

export default HealthCheckManagement;
