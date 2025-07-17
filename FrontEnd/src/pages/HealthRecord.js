import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import healthRecordService from '../services/healthRecordService';
import './HealthRecord.css';
import ErrorDialog from '../components/ErrorDialog';

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
  const [formData, setFormData] = useState({
    healthRecordID: '',
    studentID: '',
    parentID: '',
    allergies: '',
    chronicDiseases: '',
    treatmentHistory: '',
    eyesight: '',
    hearing: '',
    vaccinationHistory: '',
    note: '',
    parentContact: '',
    fullName: '',
    className: ''
  });
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRole = getUserRole();
        let records = [];
        let childrenData = [];

        if (userRole === 'Parent') {
          // Phụ huynh: Lấy danh sách con và hồ sơ sức khỏe của các con
          const childrenRes = await healthRecordService.getChildrenByParent(user.userID);
          childrenData = childrenRes.data;
          setChildren(childrenData);

          if (childrenData.length > 0) {
            // Lấy hồ sơ của tất cả các con
            const recordPromises = childrenData.map(child =>
              healthRecordService.getHealthRecordsByStudent(child.studentID)
            );
            const recordsRes = await Promise.all(recordPromises);
            records = recordsRes.flatMap(res => res.data);
          }
        } else if (userRole === 'MedicalStaff') {
          // Nhân viên y tế: Lấy tất cả hồ sơ
          const params = new URLSearchParams();
          if (selectedChild) params.append('studentId', selectedChild);
          if (filterStatus !== 'all') params.append('status', filterStatus);

          const recordsRes = await healthRecordService.getAllHealthRecords(params);
          records = recordsRes.data;
          
          // Lấy danh sách tất cả học sinh để lọc
          const childrenRes = await apiClient.get('/User/students'); 
          childrenData = childrenRes.data;
          setChildren(childrenData);
        }
        
        setHealthRecords(records);
      } catch (error) {
        console.error('Error fetching data:', error);
        setHealthRecords([]);
        setChildren([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, getUserRole, selectedChild, filterStatus]);

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
        return status;
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'Good':
        return '#38a169';
      case 'Fair':
        return '#d69e2e';
      case 'Poor':
        return '#e53e3e';
      default:
        return '#718096';
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
      eyesight: '',
      hearing: '',
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
      setError('Có lỗi xảy ra khi tạo hồ sơ.');
      setShowError(true);
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
        allergies: formData.allergies,
        chronicDiseases: formData.chronicDiseases,
        treatmentHistory: formData.treatmentHistory,
        eyesight: formData.eyesight,
        hearing: formData.hearing,
        vaccinationHistory: formData.vaccinationHistory,
        note: formData.note,
        parentContact: formData.parentContact,
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
        eyesight: '',
        hearing: '',
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
      setError('Có lỗi xảy ra khi gửi thông tin.');
      setShowError(true);
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
        <h1 className="main-title">Khai báo sức khỏe hàng ngày</h1>
        <p className="sub-title">Vui lòng chọn tên con và cập nhật thông tin sức khỏe</p>

        {/* Form khai báo */}
        <div className="daily-declaration-form">
          <form onSubmit={handleHealthRecordFormSubmit}>
            <div className="form-grid">
              {/* Child Info */}
              <div className="form-group">
                <label htmlFor="fullName">Họ và tên học sinh</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName ?? ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="className">Lớp</label>
                <input
                  type="text"
                  id="className"
                  name="className"
                  value={formData.className ?? ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Health Details */}
              <div className="form-group full-width">
                <label>Triệu chứng (nếu có)</label>
                {/* Checkbox symptoms can be added here if needed */}
              </div>

              <div className="form-group">
                <label htmlFor="allergies">Dị ứng</label>
                <input type="text" id="allergies" name="allergies" value={formData.allergies ?? ""} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="chronicDiseases">Bệnh mãn tính</label>
                <input type="text" id="chronicDiseases" name="chronicDiseases" value={formData.chronicDiseases ?? ""} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="treatmentHistory">Lịch sử điều trị</label>
                <input type="text" id="treatmentHistory" name="treatmentHistory" value={formData.treatmentHistory ?? ""} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="eyesight">Thị lực</label>
                <input type="text" id="eyesight" name="eyesight" value={formData.eyesight ?? ""} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="hearing">Thính lực</label>
                <input type="text" id="hearing" name="hearing" value={formData.hearing ?? ""} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="vaccinationHistory">Lịch sử tiêm chủng</label>
                <input type="text" id="vaccinationHistory" name="vaccinationHistory" value={formData.vaccinationHistory ?? ""} onChange={handleInputChange} />
              </div>

              <div className="form-group full-width">
                <label htmlFor="note">Ghi chú thêm</label>
                <textarea id="note" name="note" value={formData.note ?? ""} onChange={handleInputChange}></textarea>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Gửi thông tin</button>
            </div>
          </form>
        </div>

        {/* Danh sách đã khai báo */}
        <div className="records-list">
          <h2>Lịch sử khai báo</h2>
          {healthRecords.length > 0 ? (
            healthRecords.map(record => (
              <div key={record.healthRecordID} className="record-card">
                <div className="record-header">
                  <span>{record.childName} - {record.childClass}</span>
                  <span>Ngày: {new Date(record.recordDate).toLocaleDateString()}</span>
                  <span className="status" style={{ backgroundColor: getStatusColor(record.status) }}>
                    {getStatusText(record.status)}
                  </span>
                </div>
                <div className="record-body">
                  <p><strong>Ghi chú:</strong> {record.note}</p>
                </div>
              </div>
            ))
          ) : <p>Chưa có lịch sử khai báo.</p>}
        </div>
      </div>
    );
  }

  // Giao diện cho nhân viên y tế
  return (
    <div className="health-record-container">
      <div className="header">
        <h1>Quản lý hồ sơ sức khỏe</h1>
        <button className="create-btn" onClick={handleCreateRecord}>
          <i className="fas fa-plus"></i> Tạo hồ sơ mới
        </button>
      </div>

      <div className="filters">
        <select value={selectedChild ?? ""} onChange={e => setSelectedChild(e.target.value)}>
          <option value="">Tất cả học sinh</option>
          {children.map(child => (
            <option key={child.id} value={child.id}>{child.name} - {child.className}</option>
          ))}
        </select>
        <select value={filterStatus ?? ""} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Tất cả trạng thái</option>
          <option value="Submitted">Đã gửi</option>
          <option value="Under Review">Đang xem xét</option>
          <option value="Approved">Đã phê duyệt</option>
          <option value="Rejected">Từ chối</option>
        </select>
      </div>

      <div className="record-table">
        <table>
          <thead>
            <tr>
              <th>Học sinh</th>
              <th>Lớp</th>
              <th>Ngày ghi nhận</th>
              <th>Trạng thái sức khỏe</th>
              <th>Số triệu chứng</th>
              <th>Trạng thái hồ sơ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {healthRecords.map(record => (
              <tr key={record.id}>
                <td>{record.childName}</td>
                <td>{record.childClass}</td>
                <td>{new Date(record.recordDate).toLocaleDateString()}</td>
                <td>
                  <span className="health-status" style={{ backgroundColor: getHealthStatusColor(record.healthStatus) }}>
                    {record.healthStatus}
                  </span>
                </td>
                <td>{getSymptomCount(record)}</td>
                <td>
                  <span className="status" style={{ backgroundColor: getStatusColor(record.status) }}>
                    {getStatusText(record.status)}
                  </span>
                </td>
                <td>
                  <button className="details-btn" onClick={() => handleViewDetails(record)}>
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showDetailsModal && selectedRecord && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowDetailsModal(false)}>&times;</span>
            <h2>Chi tiết hồ sơ sức khỏe</h2>
            <p><strong>Học sinh:</strong> {selectedRecord.childName}</p>
            {/* Display all details of the record */}
          </div>
        </div>
      )}
      <ErrorDialog open={showError} message={error} onClose={() => setShowError(false)} />
    </div>
  );
};

export default HealthRecord;
