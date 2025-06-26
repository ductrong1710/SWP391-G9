import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import './MedicalHistory.css';

const MedicalHistory = () => {
  const navigate = useNavigate();
  const { user, getUserRole } = useAuth();
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState('all');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterType, setFilterType] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userRole = getUserRole();
      
      if (userRole === 'Parent') {
        // Fetch medical history for parent's children
        const [historyResponse, childrenResponse] = await Promise.all([
          apiClient.get(`/HealthCheckResult/parent/${user.UserID}/history`),
          apiClient.get(`/User/parent/${user.UserID}/children`)
        ]);
        const mappedHistory = (historyResponse.data || []).map(mapBackendToFrontend);
        setMedicalHistory(mappedHistory);
        setChildren(childrenResponse.data);
      } else if (userRole === 'Student') {
        // Fetch medical history for student
        const historyResponse = await apiClient.get(`/HealthCheckResult/student/${user.UserID}/history`);
        const mappedHistory = (historyResponse.data || []).map(mapBackendToFrontend);
        setMedicalHistory(mappedHistory);
        setChildren([]);
      } else {
        navigate('/dashboard');
        return;
      }
    } catch (error) {
      setMedicalHistory(getMockMedicalHistory());
      if (getUserRole() === 'Parent') {
        setChildren(getMockChildren());
      }
    } finally {
      setLoading(false);
    }
  };

  const getMockMedicalHistory = () => {
    return [
      {
        id: 1,
        childId: 1,
        childName: 'Nguyễn Văn An',
        className: '10A1',
        checkupDate: '2024-12-15',
        checkupType: 'Periodic',
        doctor: 'BS. Trần Thị Bình',
        status: 'Completed',
        result: {
          height: '165cm',
          weight: '55kg',
          bloodPressure: '120/80',
          heartRate: '72',
          temperature: '36.5',
          vision: '10/10',
          hearing: 'Bình thường',
          dental: 'Tốt',
          skin: 'Bình thường',
          respiratory: 'Bình thường',
          cardiovascular: 'Bình thường',
          gastrointestinal: 'Bình thường',
          musculoskeletal: 'Bình thường',
          neurological: 'Bình thường',
          notes: 'Sức khỏe tốt, không có vấn đề gì đặc biệt',
          recommendations: 'Duy trì chế độ ăn uống và tập luyện hiện tại',
          followUpRequired: false,
          followUpDate: null,
          followUpReason: null
        }
      },
      {
        id: 2,
        childId: 1,
        childName: 'Nguyễn Văn An',
        className: '10A1',
        checkupDate: '2024-06-15',
        checkupType: 'Periodic',
        doctor: 'BS. Lê Văn Cường',
        status: 'Completed',
        result: {
          height: '163cm',
          weight: '53kg',
          bloodPressure: '118/78',
          heartRate: '70',
          temperature: '36.6',
          vision: '10/10',
          hearing: 'Bình thường',
          dental: 'Tốt',
          skin: 'Bình thường',
          respiratory: 'Bình thường',
          cardiovascular: 'Bình thường',
          gastrointestinal: 'Bình thường',
          musculoskeletal: 'Bình thường',
          neurological: 'Bình thường',
          notes: 'Sức khỏe tốt, tăng trưởng bình thường',
          recommendations: 'Tiếp tục chế độ dinh dưỡng và tập luyện',
          followUpRequired: false,
          followUpDate: null,
          followUpReason: null
        }
      },
      {
        id: 3,
        childId: 2,
        childName: 'Nguyễn Thị Bình',
        className: '8A2',
        checkupDate: '2024-12-10',
        checkupType: 'Special',
        doctor: 'BS. Phạm Thị Dung',
        status: 'Completed',
        result: {
          height: '155cm',
          weight: '48kg',
          bloodPressure: '115/75',
          heartRate: '75',
          temperature: '37.2',
          vision: '9/10',
          hearing: 'Bình thường',
          dental: 'Cần chăm sóc',
          skin: 'Bình thường',
          respiratory: 'Bình thường',
          cardiovascular: 'Bình thường',
          gastrointestinal: 'Bình thường',
          musculoskeletal: 'Bình thường',
          neurological: 'Bình thường',
          notes: 'Học sinh có vấn đề nhẹ về răng miệng, cần chăm sóc thêm',
          recommendations: 'Đánh răng đều đặn, khám răng định kỳ',
          followUpRequired: true,
          followUpDate: '2025-01-15',
          followUpReason: 'Kiểm tra lại tình trạng răng miệng'
        }
      }
    ];
  };

  const getMockChildren = () => {
    return [
      { id: 1, name: 'Nguyễn Văn An', className: '10A1' },
      { id: 2, name: 'Nguyễn Thị Bình', className: '8A2' }
    ];
  };

  const filteredHistory = medicalHistory.filter(record => {
    const childMatch = selectedChild === 'all' || record.childId === parseInt(selectedChild);
    const yearMatch = new Date(record.checkupDate).getFullYear() === filterYear;
    const typeMatch = filterType === 'all' || record.checkupType === filterType;
    return childMatch && yearMatch && typeMatch;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'Periodic':
        return '#3182ce';
      case 'Special':
        return '#d69e2e';
      case 'Follow-up':
        return '#38a169';
      default:
        return '#718096';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'Periodic':
        return 'Định kỳ';
      case 'Special':
        return 'Đặc biệt';
      case 'Follow-up':
        return 'Theo dõi';
      default:
        return type;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#38a169';
      case 'In Progress':
        return '#d69e2e';
      case 'Scheduled':
        return '#3182ce';
      default:
        return '#718096';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Completed':
        return 'Hoàn thành';
      case 'In Progress':
        return 'Đang thực hiện';
      case 'Scheduled':
        return 'Đã lên lịch';
      default:
        return status;
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const calculateBMI = (height, weight) => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { category: 'Thiếu cân', color: '#d69e2e' };
    if (bmi < 25) return { category: 'Bình thường', color: '#38a169' };
    if (bmi < 30) return { category: 'Thừa cân', color: '#d69e2e' };
    return { category: 'Béo phì', color: '#e53e3e' };
  };

  const mapBackendToFrontend = (record) => ({
    id: record.id || record.ID,
    healthCheckConsentID: record.healthCheckConsentID || record.HealthCheckConsentID,
    height: record.height || record.Height,
    weight: record.weight || record.Weight,
    bloodPressure: record.bloodPressure || record.BloodPressure,
    heartRate: record.heartRate || record.HeartRate,
    eyesight: record.eyesight || record.Eyesight,
    hearing: record.hearing || record.Hearing,
    oralHealth: record.oralHealth || record.OralHealth,
    spine: record.spine || record.Spine,
    conclusion: record.conclusion || record.Conclusion,
    checkUpDate: record.checkUpDate || record.CheckUpDate,
    checker: record.checker || record.Checker,
    consultationRecommended: record.consultationRecommended || record.ConsultationRecommended,
    consultationAppointmentDate: record.consultationAppointmentDate || record.ConsultationAppointmentDate
  });

  if (loading) {
    return (
      <div className="medical-history-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="medical-history-container">
      <div className="history-header">
        <h1>Lịch sử kiểm tra y tế</h1>
        <p>Xem lịch sử các lần kiểm tra sức khỏe và kết quả chi tiết</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        {getUserRole() === 'Parent' && (
          <div className="filter-group">
            <label>Con em:</label>
            <select 
              value={selectedChild} 
              onChange={(e) => setSelectedChild(e.target.value)}
            >
              <option value="all">Tất cả con em</option>
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} - {child.className}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="filter-group">
          <label>Năm:</label>
          <select 
            value={filterYear} 
            onChange={(e) => setFilterYear(parseInt(e.target.value))}
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Loại kiểm tra:</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Tất cả loại</option>
            <option value="Periodic">Định kỳ</option>
            <option value="Special">Đặc biệt</option>
            <option value="Follow-up">Theo dõi</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-stethoscope"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{filteredHistory.length}</div>
            <div className="stat-label">Tổng số lần kiểm tra</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {filteredHistory.filter(r => r.status === 'Completed').length}
            </div>
            <div className="stat-label">Đã hoàn thành</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon followup">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {filteredHistory.filter(r => r.result?.followUpRequired).length}
            </div>
            <div className="stat-label">Cần theo dõi</div>
          </div>
        </div>
      </div>

      {/* Medical History List */}
      <div className="history-list">
        {filteredHistory.map((record) => {
          const bmi = calculateBMI(record.result?.height, record.result?.weight);
          const bmiCategory = getBMICategory(bmi);
          
          return (
            <div key={record.id} className="history-card">
              <div className="history-header">
                <div className="history-title">
                  <h3>Kiểm tra - {record.childName || 'Học sinh'}</h3>
                  <div className="history-badges">
                    <span 
                      className="type-badge"
                      style={{ backgroundColor: getTypeColor(record.checkupType) }}
                    >
                      {getTypeText(record.checkupType)}
                    </span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(record.status) }}
                    >
                      {getStatusText(record.status)}
                    </span>
                  </div>
                </div>
                <div className="history-date">
                  <i className="fas fa-calendar"></i>
                  {new Date(record.checkupDate).toLocaleDateString('vi-VN')}
                </div>
              </div>

              <div className="history-content">
                <div className="basic-info">
                  <h4>Thông tin cơ bản</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Học sinh:</span>
                      <span className="info-value">{record.childName || 'Học sinh'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Lớp:</span>
                      <span className="info-value">{record.className}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Bác sĩ:</span>
                      <span className="info-value">{record.doctor}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Ngày kiểm tra:</span>
                      <span className="info-value">{new Date(record.checkupDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                {record.result && (
                  <>
                    <div className="vital-signs">
                      <h4>Dấu hiệu sinh tồn</h4>
                      <div className="vitals-grid">
                        {record.result.height && (
                          <div className="vital-item">
                            <span className="vital-label">Chiều cao:</span>
                            <span className="vital-value">{record.result.height}</span>
                          </div>
                        )}
                        {record.result.weight && (
                          <div className="vital-item">
                            <span className="vital-label">Cân nặng:</span>
                            <span className="vital-value">{record.result.weight}</span>
                          </div>
                        )}
                        {bmi && (
                          <div className="vital-item">
                            <span className="vital-label">BMI:</span>
                            <span 
                              className="vital-value"
                              style={{ color: bmiCategory?.color }}
                            >
                              {bmi} ({bmiCategory?.category})
                            </span>
                          </div>
                        )}
                        {record.result.bloodPressure && (
                          <div className="vital-item">
                            <span className="vital-label">Huyết áp:</span>
                            <span className="vital-value">{record.result.bloodPressure}</span>
                          </div>
                        )}
                        {record.result.heartRate && (
                          <div className="vital-item">
                            <span className="vital-label">Nhịp tim:</span>
                            <span className="vital-value">{record.result.heartRate} bpm</span>
                          </div>
                        )}
                        {record.result.temperature && (
                          <div className="vital-item">
                            <span className="vital-label">Nhiệt độ:</span>
                            <span className="vital-value">{record.result.temperature}°C</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="examination-results">
                      <h4>Kết quả khám</h4>
                      <div className="exam-grid">
                        {record.result.vision && (
                          <div className="exam-item">
                            <span className="exam-label">Thị lực:</span>
                            <span className="exam-value">{record.result.vision}</span>
                          </div>
                        )}
                        {record.result.hearing && (
                          <div className="exam-item">
                            <span className="exam-label">Thính lực:</span>
                            <span className="exam-value">{record.result.hearing}</span>
                          </div>
                        )}
                        {record.result.dental && (
                          <div className="exam-item">
                            <span className="exam-label">Răng miệng:</span>
                            <span className="exam-value">{record.result.dental}</span>
                          </div>
                        )}
                        {record.result.skin && (
                          <div className="exam-item">
                            <span className="exam-label">Da:</span>
                            <span className="exam-value">{record.result.skin}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {record.result.notes && (
                      <div className="notes-section">
                        <h4>Ghi chú</h4>
                        <p>{record.result.notes}</p>
                      </div>
                    )}

                    {record.result.recommendations && (
                      <div className="recommendations-section">
                        <h4>Khuyến nghị</h4>
                        <p>{record.result.recommendations}</p>
                      </div>
                    )}

                    {record.result.followUpRequired && (
                      <div className="followup-section">
                        <h4>Theo dõi</h4>
                        <p><strong>Ngày theo dõi:</strong> {new Date(record.result.followUpDate).toLocaleDateString('vi-VN')}</p>
                        <p><strong>Lý do:</strong> {record.result.followUpReason}</p>
                      </div>
                    )}
                  </>
                )}

                <div className="history-actions">
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
          );
        })}

        {filteredHistory.length === 0 && (
          <div className="no-results">
            <i className="fas fa-stethoscope"></i>
            <p>Không tìm thấy lịch sử kiểm tra nào</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRecord && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết kiểm tra - {selectedRecord.childName || 'Học sinh'}</h3>
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
                    <label>Học sinh:</label>
                    <span>{selectedRecord.childName || 'Học sinh'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Lớp:</label>
                    <span>{selectedRecord.className}</span>
                  </div>
                  <div className="detail-item">
                    <label>Loại kiểm tra:</label>
                    <span>{getTypeText(selectedRecord.checkupType)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày kiểm tra:</label>
                    <span>{new Date(selectedRecord.checkupDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="detail-item">
                    <label>Bác sĩ:</label>
                    <span>{selectedRecord.doctor}</span>
                  </div>
                  <div className="detail-item">
                    <label>Trạng thái:</label>
                    <span>{getStatusText(selectedRecord.status)}</span>
                  </div>
                </div>
              </div>

              {selectedRecord.result && (
                <>
                  <div className="detail-section">
                    <h4>Dấu hiệu sinh tồn</h4>
                    <div className="detail-grid">
                      {selectedRecord.result.height && (
                        <div className="detail-item">
                          <label>Chiều cao:</label>
                          <span>{selectedRecord.result.height}</span>
                        </div>
                      )}
                      {selectedRecord.result.weight && (
                        <div className="detail-item">
                          <label>Cân nặng:</label>
                          <span>{selectedRecord.result.weight}</span>
                        </div>
                      )}
                      {selectedRecord.result.bloodPressure && (
                        <div className="detail-item">
                          <label>Huyết áp:</label>
                          <span>{selectedRecord.result.bloodPressure}</span>
                        </div>
                      )}
                      {selectedRecord.result.heartRate && (
                        <div className="detail-item">
                          <label>Nhịp tim:</label>
                          <span>{selectedRecord.result.heartRate} bpm</span>
                        </div>
                      )}
                      {selectedRecord.result.temperature && (
                        <div className="detail-item">
                          <label>Nhiệt độ:</label>
                          <span>{selectedRecord.result.temperature}°C</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Khám lâm sàng</h4>
                    <div className="detail-grid">
                      {selectedRecord.result.vision && (
                        <div className="detail-item">
                          <label>Thị lực:</label>
                          <span>{selectedRecord.result.vision}</span>
                        </div>
                      )}
                      {selectedRecord.result.hearing && (
                        <div className="detail-item">
                          <label>Thính lực:</label>
                          <span>{selectedRecord.result.hearing}</span>
                        </div>
                      )}
                      {selectedRecord.result.dental && (
                        <div className="detail-item">
                          <label>Răng miệng:</label>
                          <span>{selectedRecord.result.dental}</span>
                        </div>
                      )}
                      {selectedRecord.result.skin && (
                        <div className="detail-item">
                          <label>Da:</label>
                          <span>{selectedRecord.result.skin}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Khám hệ thống</h4>
                    <div className="detail-grid">
                      {selectedRecord.result.respiratory && (
                        <div className="detail-item">
                          <label>Hô hấp:</label>
                          <span>{selectedRecord.result.respiratory}</span>
                        </div>
                      )}
                      {selectedRecord.result.cardiovascular && (
                        <div className="detail-item">
                          <label>Tim mạch:</label>
                          <span>{selectedRecord.result.cardiovascular}</span>
                        </div>
                      )}
                      {selectedRecord.result.gastrointestinal && (
                        <div className="detail-item">
                          <label>Tiêu hóa:</label>
                          <span>{selectedRecord.result.gastrointestinal}</span>
                        </div>
                      )}
                      {selectedRecord.result.musculoskeletal && (
                        <div className="detail-item">
                          <label>Cơ xương khớp:</label>
                          <span>{selectedRecord.result.musculoskeletal}</span>
                        </div>
                      )}
                      {selectedRecord.result.neurological && (
                        <div className="detail-item">
                          <label>Thần kinh:</label>
                          <span>{selectedRecord.result.neurological}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedRecord.result.notes && (
                    <div className="detail-section">
                      <h4>Ghi chú</h4>
                      <p>{selectedRecord.result.notes}</p>
                    </div>
                  )}

                  {selectedRecord.result.recommendations && (
                    <div className="detail-section">
                      <h4>Khuyến nghị</h4>
                      <p>{selectedRecord.result.recommendations}</p>
                    </div>
                  )}

                  {selectedRecord.result.followUpRequired && (
                    <div className="detail-section">
                      <h4>Theo dõi</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Ngày theo dõi:</label>
                          <span>{new Date(selectedRecord.result.followUpDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="detail-item">
                          <label>Lý do:</label>
                          <span>{selectedRecord.result.followUpReason}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistory; 