import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import './HealthDeclaration.css';

const HealthRecord = () => {
  const navigate = useNavigate();
  const { user, getUserRole } = useAuth();
  const [healthRecords, setHealthRecords] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [formData, setFormData] = useState({
    childId: '',
    declarationDate: new Date().toISOString().split('T')[0],
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
    allergies: '',
    emergencyContact: '',
    emergencyPhone: '',
    additionalNotes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userRole = getUserRole();
      if (userRole !== 'Parent') {
        navigate('/dashboard');
        return;
      }
      const [recordsResponse, childrenResponse] = await Promise.all([
        apiClient.get(`/api/HealthRecord/parent/${user.UserID}`),
        apiClient.get(`/api/User/parent/${user.UserID}/children`)
      ]);
      setHealthRecords(recordsResponse.data);
      setChildren(childrenResponse.data);
    } catch (error) {
      setHealthRecords(getMockHealthRecords());
      setChildren(getMockChildren());
    } finally {
      setLoading(false);
    }
  };

  const getMockHealthRecords = () => {
    return [
      {
        id: 1,
        childId: 1,
        childName: 'Nguyễn Văn An',
        childClass: '10A1',
        declarationDate: '2024-12-15',
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
        declarationDate: '2024-12-14',
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

  const handleCreateDeclaration = () => {
    setFormData({
      childId: '',
      declarationDate: new Date().toISOString().split('T')[0],
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
      allergies: '',
      emergencyContact: '',
      emergencyPhone: '',
      additionalNotes: ''
    });
    setShowCreateModal(true);
  };

  const handleViewDetails = (record) => {
    setSelectedDeclaration(record);
    setShowDetailsModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitDeclaration = async (e) => {
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

      const response = await apiClient.post('/api/HealthRecord', newRecord);
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

  if (loading && healthRecords.length === 0) {
    return (
      <div className="health-declaration-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="health-declaration-container">
      <div className="declaration-header">
        <h1>Khai báo sức khỏe</h1>
        <p>Khai báo tình trạng sức khỏe của con em hàng ngày</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Con em:</label>
          <select 
            value={selectedChild} 
            onChange={(e) => setSelectedChild(e.target.value)}
          >
            <option value="">Tất cả con em</option>
            {children.map(child => (
              <option key={child.id} value={child.id}>
                {child.name} - {child.className}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Trạng thái:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Submitted">Đã gửi</option>
            <option value="Under Review">Đang xem xét</option>
            <option value="Approved">Đã phê duyệt</option>
            <option value="Rejected">Từ chối</option>
          </select>
        </div>

        <button 
          className="create-declaration-btn"
          onClick={handleCreateDeclaration}
        >
          <i className="fas fa-plus"></i>
          Khai báo mới
        </button>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{filteredRecords.length}</div>
            <div className="stat-label">Tổng số khai báo</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon approved">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {filteredRecords.filter(d => d.status === 'Approved').length}
            </div>
            <div className="stat-label">Đã phê duyệt</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon review">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {filteredRecords.filter(d => d.status === 'Under Review').length}
            </div>
            <div className="stat-label">Đang xem xét</div>
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="records-list">
        {filteredRecords.map((record) => (
          <div key={record.id} className="record-card">
            <div className="record-header">
              <div className="record-title">
                <h3>Khai báo - {record.childName}</h3>
                <div className="record-badges">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(record.status) }}
                  >
                    {getStatusText(record.status)}
                  </span>
                  <span 
                    className="health-badge"
                    style={{ backgroundColor: getHealthStatusColor(record.healthStatus) }}
                  >
                    {record.healthStatus}
                  </span>
                </div>
              </div>
              <div className="record-date">
                <i className="fas fa-calendar"></i>
                {new Date(record.declarationDate).toLocaleDateString('vi-VN')}
              </div>
            </div>

            <div className="record-content">
              <div className="child-info">
                <h4>Thông tin con em</h4>
                <p><strong>Họ tên:</strong> {record.childName}</p>
                <p><strong>Lớp:</strong> {record.childClass}</p>
                <p><strong>Tình trạng sức khỏe:</strong> {record.healthStatus}</p>
                <p><strong>Số triệu chứng:</strong> {getSymptomCount(record)}</p>
              </div>

              <div className="symptoms-summary">
                <h4>Tóm tắt triệu chứng</h4>
                <div className="symptoms-list">
                  {record.hasFever && <span className="symptom-tag">Sốt</span>}
                  {record.hasCough && <span className="symptom-tag">Ho</span>}
                  {record.hasSoreThroat && <span className="symptom-tag">Đau họng</span>}
                  {record.hasHeadache && <span className="symptom-tag">Đau đầu</span>}
                  {record.hasRunnyNose && <span className="symptom-tag">Sổ mũi</span>}
                  {record.hasFatigue && <span className="symptom-tag">Mệt mỏi</span>}
                  {getSymptomCount(record) === 0 && (
                    <span className="no-symptoms">Không có triệu chứng</span>
                  )}
                </div>
              </div>

              {record.currentMedications && (
                <div className="medications-info">
                  <h4>Thuốc đang sử dụng</h4>
                  <p>{record.currentMedications}</p>
                </div>
              )}

              {record.additionalNotes && (
                <div className="additional-notes">
                  <h4>Ghi chú bổ sung</h4>
                  <p>{record.additionalNotes}</p>
                </div>
              )}

              {record.status === 'Under Review' && record.reviewNotes && (
                <div className="review-notes">
                  <h4>Ghi chú từ nhân viên y tế</h4>
                  <p>{record.reviewNotes}</p>
                </div>
              )}

              <div className="record-actions">
                <button 
                  className="view-details-btn"
                  onClick={() => handleViewDetails(record)}
                >
                  <i className="fas fa-eye"></i>
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredRecords.length === 0 && (
          <div className="no-results">
            <i className="fas fa-clipboard-list"></i>
            <p>Không tìm thấy khai báo sức khỏe nào</p>
          </div>
        )}
      </div>

      {/* Create Declaration Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="create-declaration-modal">
            <div className="modal-header">
              <h3>Khai báo sức khỏe mới</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitDeclaration}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Con em:</label>
                  <select
                    name="childId"
                    value={formData.childId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn con em</option>
                    {children.map(child => (
                      <option key={child.id} value={child.id}>
                        {child.name} - {child.className}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày khai báo:</label>
                    <input
                      type="date"
                      name="declarationDate"
                      value={formData.declarationDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tình trạng sức khỏe:</label>
                    <select
                      name="healthStatus"
                      value={formData.healthStatus}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Good">Tốt</option>
                      <option value="Fair">Khá</option>
                      <option value="Poor">Kém</option>
                    </select>
                  </div>
                </div>

                <div className="symptoms-section">
                  <h4>Triệu chứng (nếu có)</h4>
                  <div className="symptoms-grid">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="hasFever"
                        checked={formData.hasFever}
                        onChange={handleInputChange}
                      />
                      Sốt
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="hasCough"
                        checked={formData.hasCough}
                        onChange={handleInputChange}
                      />
                      Ho
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="hasSoreThroat"
                        checked={formData.hasSoreThroat}
                        onChange={handleInputChange}
                      />
                      Đau họng
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="hasHeadache"
                        checked={formData.hasHeadache}
                        onChange={handleInputChange}
                      />
                      Đau đầu
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="hasRunnyNose"
                        checked={formData.hasRunnyNose}
                        onChange={handleInputChange}
                      />
                      Sổ mũi
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="hasFatigue"
                        checked={formData.hasFatigue}
                        onChange={handleInputChange}
                      />
                      Mệt mỏi
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Thuốc đang sử dụng (nếu có):</label>
                  <textarea
                    name="currentMedications"
                    value={formData.currentMedications}
                    onChange={handleInputChange}
                    placeholder="Nhập tên thuốc đang sử dụng..."
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>Dị ứng (nếu có):</label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    placeholder="Nhập thông tin dị ứng..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Liên hệ khẩn cấp:</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="Tên người liên hệ..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại khẩn cấp:</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      placeholder="Số điện thoại..."
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Ghi chú bổ sung:</label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Nhập ghi chú bổ sung..."
                    rows="3"
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
                  {loading ? 'Đang gửi...' : 'Gửi khai báo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedDeclaration && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết khai báo - {selectedDeclaration.childName}</h3>
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
                    <label>Con em:</label>
                    <span>{selectedDeclaration.childName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Lớp:</label>
                    <span>{selectedDeclaration.childClass}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày khai báo:</label>
                    <span>{new Date(selectedDeclaration.declarationDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tình trạng sức khỏe:</label>
                    <span>{selectedDeclaration.healthStatus}</span>
                  </div>
                  <div className="detail-item">
                    <label>Trạng thái:</label>
                    <span>{getStatusText(selectedDeclaration.status)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Triệu chứng chi tiết</h4>
                <div className="symptoms-detail">
                  <div className="symptoms-grid">
                    <div className="symptom-item">
                      <span className="symptom-label">Sốt:</span>
                      <span className="symptom-value">{selectedDeclaration.hasFever ? 'Có' : 'Không'}</span>
                    </div>
                    <div className="symptom-item">
                      <span className="symptom-label">Ho:</span>
                      <span className="symptom-value">{selectedDeclaration.hasCough ? 'Có' : 'Không'}</span>
                    </div>
                    <div className="symptom-item">
                      <span className="symptom-label">Đau họng:</span>
                      <span className="symptom-value">{selectedDeclaration.hasSoreThroat ? 'Có' : 'Không'}</span>
                    </div>
                    <div className="symptom-item">
                      <span className="symptom-label">Đau đầu:</span>
                      <span className="symptom-value">{selectedDeclaration.hasHeadache ? 'Có' : 'Không'}</span>
                    </div>
                    <div className="symptom-item">
                      <span className="symptom-label">Sổ mũi:</span>
                      <span className="symptom-value">{selectedDeclaration.hasRunnyNose ? 'Có' : 'Không'}</span>
                    </div>
                    <div className="symptom-item">
                      <span className="symptom-label">Mệt mỏi:</span>
                      <span className="symptom-value">{selectedDeclaration.hasFatigue ? 'Có' : 'Không'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedDeclaration.currentMedications && (
                <div className="detail-section">
                  <h4>Thuốc đang sử dụng</h4>
                  <p>{selectedDeclaration.currentMedications}</p>
                </div>
              )}

              {selectedDeclaration.allergies && (
                <div className="detail-section">
                  <h4>Dị ứng</h4>
                  <p>{selectedDeclaration.allergies}</p>
                </div>
              )}

              <div className="detail-section">
                <h4>Thông tin liên hệ khẩn cấp</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Người liên hệ:</label>
                    <span>{selectedDeclaration.emergencyContact}</span>
                  </div>
                  <div className="detail-item">
                    <label>Số điện thoại:</label>
                    <span>{selectedDeclaration.emergencyPhone}</span>
                  </div>
                </div>
              </div>

              {selectedDeclaration.additionalNotes && (
                <div className="detail-section">
                  <h4>Ghi chú bổ sung</h4>
                  <p>{selectedDeclaration.additionalNotes}</p>
                </div>
              )}

              {selectedDeclaration.status === 'Under Review' && selectedDeclaration.reviewNotes && (
                <div className="detail-section">
                  <h4>Ghi chú từ nhân viên y tế</h4>
                  <p>{selectedDeclaration.reviewNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthRecord;
