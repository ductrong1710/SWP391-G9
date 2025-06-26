import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import healthRecordService from '../services/healthRecordService';
import './HealthRecord.css';

const HealthRecord = () => {
  const navigate = useNavigate();
  const { user, getUserRole } = useAuth();
  const [healthRecords, setHealthRecords] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
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
    parentContact: ''
  });

  const getMockHealthRecords = () => {
    return [
      {
        id: 1,
        childId: 1,
        childName: 'Nguyễn Văn An',
        childClass: '10A1',
        recordDate: '2024-12-15',
        healthStatus: 'Good',
        hasFever: false,
        hasCough: false,
        hasShortnessOfBreath: false,
        hasFatigue: false,
        hasLossOfTaste: false,
        hasLossOfSmell: false,
        hasSoreThroat: false,
        hasHeadache: false,
        hasMusclePain: false,
        hasDiarrhea: false,
        hasNausea: false,
        hasVomiting: false,
        hasRunnyNose: false,
        hasCongestion: false,
        hasChills: false,
        hasBodyAches: false,
        hasRecentTravel: false,
        travelDetails: '',
        hasContactWithSick: false,
        contactDetails: '',
        hasUnderlyingConditions: false,
        underlyingConditions: '',
        currentMedications: '',
        allergies: 'Không có',
        emergencyContact: 'Nguyễn Văn Phụ Huynh',
        emergencyPhone: '0901234567',
        additionalNotes: 'Học sinh khỏe mạnh, không có triệu chứng bất thường',
        status: 'Submitted',
        reviewedBy: null,
        reviewDate: null,
        reviewNotes: null
      },
      {
        id: 2,
        childId: 2,
        childName: 'Nguyễn Thị Bình',
        childClass: '8A2',
        recordDate: '2024-12-14',
        healthStatus: 'Fair',
        hasFever: false,
        hasCough: true,
        hasShortnessOfBreath: false,
        hasFatigue: false,
        hasLossOfTaste: false,
        hasLossOfSmell: false,
        hasSoreThroat: true,
        hasHeadache: false,
        hasMusclePain: false,
        hasDiarrhea: false,
        hasNausea: false,
        hasVomiting: false,
        hasRunnyNose: true,
        hasCongestion: false,
        hasChills: false,
        hasBodyAches: false,
        hasRecentTravel: false,
        travelDetails: '',
        hasContactWithSick: false,
        contactDetails: '',
        hasUnderlyingConditions: false,
        underlyingConditions: '',
        currentMedications: 'Thuốc ho, thuốc cảm',
        allergies: 'Không có',
        emergencyContact: 'Nguyễn Văn Phụ Huynh',
        emergencyPhone: '0901234567',
        additionalNotes: 'Học sinh có triệu chứng ho và đau họng nhẹ, đang điều trị',
        status: 'Under Review',
        reviewedBy: 'BS. Trần Thị Bình',
        reviewDate: '2024-12-15',
        reviewNotes: 'Cần theo dõi thêm, có thể đến trường nếu triệu chứng nhẹ'
      }
    ];
  };

  const getMockChildren = () => {
    return [
      { id: 1, name: 'Nguyễn Văn An', className: '10A1' },
      { id: 2, name: 'Nguyễn Thị Bình', className: '8A2' }
    ];
  };

  const filteredRecords = healthRecords.filter(record => {
    const childMatch = selectedChild === '' || record.childId === parseInt(selectedChild);
    const statusMatch = filterStatus === 'all' || record.status === filterStatus;
    return childMatch && statusMatch;
  });

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
      parentContact: ''
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
    try {
      setLoading(true);
      const selectedChildData = children.find(c => c.id === parseInt(formData.childId));
      const newRecord = {
        ...formData,
        childId: parseInt(formData.childId),
        childName: selectedChildData?.name || '',
        childClass: selectedChildData?.className || '',
        status: 'Submitted',
        reviewedBy: null,
        reviewDate: null,
        reviewNotes: null
      };
      const response = await apiClient.post('/HealthRecord', newRecord);
      setHealthRecords([...healthRecords, response.data]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating health record:', error);
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
      const newRecord = { ...formData };
      await apiClient.post('/HealthRecord', newRecord);
      setFormData({
        healthRecordID: '', studentID: '', parentID: '', allergies: '', chronicDiseases: '', treatmentHistory: '', eyesight: '', hearing: '', vaccinationHistory: '', note: '', parentContact: ''
      });
      alert('Lưu hồ sơ sức khỏe thành công!');
    } catch (error) {
      alert('Có lỗi khi lưu hồ sơ sức khỏe!');
      console.error('Error creating health record:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading && healthRecords.length === 0) {
    // Xóa điều kiện này hoặc luôn trả về null
    // return (
    //   <div className="health-record-container">
    //     <div className="loading-spinner"></div>
    //   </div>
    // );
  }

  return (
    <div className="health-record-form-container" style={{maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24}}>
      <h2 style={{textAlign: 'center', marginBottom: 24}}>Khai báo hồ sơ sức khỏe</h2>
      <form className="health-record-form" onSubmit={handleHealthRecordFormSubmit} autoComplete="off">
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
          <div className="form-group">
            <label>Họ và tên:</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required style={{width: '100%'}} />
          </div>
          <div className="form-group">
            <label>Lớp:</label>
            <input type="text" name="className" value={formData.className} onChange={handleInputChange} required style={{width: '100%'}} />
          </div>
          <div className="form-group">
            <label>Dị ứng:</label>
            <input type="text" name="allergies" value={formData.allergies} onChange={handleInputChange} style={{width: '100%'}} />
          </div>
          <div className="form-group">
            <label>Lịch sử điều trị:</label>
            <input type="text" name="treatmentHistory" value={formData.treatmentHistory} onChange={handleInputChange} style={{width: '100%'}} />
          </div>
          <div className="form-group">
            <label>Bệnh mãn tính:</label>
            <input type="text" name="chronicDiseases" value={formData.chronicDiseases} onChange={handleInputChange} style={{width: '100%'}} />
          </div>
          <div className="form-group">
            <label>Thị lực:</label>
            <input type="number" name="eyesight" value={formData.eyesight} onChange={handleInputChange} style={{width: '100%'}} />
          </div>
          <div className="form-group">
            <label>Thính lực:</label>
            <input type="number" name="hearing" value={formData.hearing} onChange={handleInputChange} style={{width: '100%'}} />
          </div>
          <div className="form-group">
            <label>Lịch sử tiêm chủng:</label>
            <input type="text" name="vaccinationHistory" value={formData.vaccinationHistory} onChange={handleInputChange} style={{width: '100%'}} />
          </div>
          <div className="form-group">
            <label>Ghi chú:</label>
            <input type="text" name="note" value={formData.note} onChange={handleInputChange} style={{width: '100%'}} />
          </div>
          <div className="form-group">
            <label>Số điện thoại liên hệ:</label>
            <input type="text" name="parentContact" value={formData.parentContact} onChange={handleInputChange} style={{width: '100%'}} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{marginTop: 24, width: '100%'}}>Lưu hồ sơ sức khỏe</button>
      </form>
    </div>
  );
};

export default HealthRecord;
