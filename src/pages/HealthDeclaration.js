import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import healthRecordService from '../services/healthRecordService';
import './HealthDeclaration.css';

const HealthDeclaration = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    studentClass: '',
    recordDate: new Date().toISOString().split('T')[0],
    allergies: '',
    chronicDiseases: '',
    treatmentHistory: '',
    eyesight: '',
    hearing: '',
    vaccinationHistory: '',
    note: '',
    parentContact: '',
    parentId: localStorage.getItem('userId') || '',
    parentalConsent: false
  });

  const [alerts, setAlerts] = useState({ success: false });
  const [healthRecordHistory, setHealthRecordHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [backendConnection, setBackendConnection] = useState({ checking: true, connected: false, message: '' });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/health-declaration' }, manualLogin: true } });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, recordDate: new Date().toISOString().split('T')[0] }));
  }, []);

  useEffect(() => {
    const fetchHealthRecordHistory = async () => {
      if (!isAuthenticated) return;
      setLoadingHistory(true);
      try {
        const studentId = localStorage.getItem('studentId');
        if (studentId) {
          const records = await healthRecordService.getHealthRecordsByStudentId(studentId);
          setHealthRecordHistory(records);
        }
      } catch (error) {
        setHealthRecordHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHealthRecordHistory();
  }, [isAuthenticated]);

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const connectionStatus = await healthRecordService.checkBackendConnection();
        setBackendConnection({ checking: false, connected: connectionStatus.connected, message: connectionStatus.message });
      } catch (error) {
        setBackendConnection({ checking: false, connected: false, message: 'Không thể kết nối với backend. Vui lòng kiểm tra kết nối mạng và đảm bảo server đang chạy.' });
      }
    };
    checkBackendConnection();
  }, []);

  if (loading || !isAuthenticated) {
    return <div style={{ display: 'flex', justifyContent: 'center', margin: '50px 0' }}><div className="loading-spinner">Đang kiểm tra thông tin đăng nhập...</div></div>;
  }
  if (backendConnection.checking) {
    return <div style={{ display: 'flex', justifyContent: 'center', margin: '50px 0' }}><div className="loading-spinner">Đang kiểm tra kết nối với server...</div></div>;
  }
  if (!backendConnection.connected) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '50px 0' }}>
        <div className="alert alert-danger" style={{ maxWidth: '600px' }}>
          <h4 className="alert-heading"><i className="fas fa-exclamation-triangle me-2"></i>Lỗi kết nối</h4>
          <p>{backendConnection.message}</p>
          <hr />
          <p className="mb-0">Vui lòng liên hệ với quản trị viên hoặc thử lại sau.</p>
          <button className="btn btn-primary mt-3" onClick={async () => {
            setBackendConnection({ checking: true, connected: false, message: '' });
            const connectionStatus = await healthRecordService.checkBackendConnection();
            setBackendConnection({ checking: false, connected: connectionStatus.connected, message: connectionStatus.message });
          }}>
            <i className="fas fa-sync-alt me-2"></i>Thử lại
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId) {
      alert('Không tìm thấy học sinh để khai báo sức khỏe!');
      return;
    }
    if (!formData.studentName || !formData.studentClass) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc!');
      return;
    }
    if (!formData.parentalConsent) {
      alert('Bạn phải xác nhận thông tin khai báo là chính xác và đồng ý để trường theo dõi sức khỏe!');
      return;
    }
    const healthRecordData = {
      healthRecordId: '00000000-0000-0000-0000-000000000000',
      studentId: formData.studentId,
      allergies: formData.allergies || '',
      chronicDiseases: formData.chronicDiseases || '',
      treatmentHistory: formData.treatmentHistory || '',
      eyesight: formData.eyesight || '',
      hearing: formData.hearing || '',
      vaccinationHistory: formData.vaccinationHistory || '',
      note: formData.note || '',
      parentId: formData.parentId || localStorage.getItem('userId') || '',
      parentContact: formData.parentContact || localStorage.getItem('userContact') || '',
      recordDate: formData.recordDate
    };
    try {
      await healthRecordService.createHealthRecord(healthRecordData);
      setAlerts({ success: true });
      setFormData({
        studentId: '', studentName: '', studentClass: '', recordDate: new Date().toISOString().split('T')[0], allergies: '', chronicDiseases: '', treatmentHistory: '', eyesight: '', hearing: '', vaccinationHistory: '', note: '', parentContact: '', parentId: localStorage.getItem('userId') || '', parentalConsent: false
      });
      setTimeout(() => setAlerts({ success: false }), 3000);
    } catch (error) {
      alert('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau!');
    }
  };

  const HealthRecordHistory = () => {
    if (loadingHistory) return <div className="mt-4 text-center">Đang tải lịch sử khai báo...</div>;
    if (healthRecordHistory.length === 0) return <div className="mt-4 text-center">Chưa có lịch sử khai báo sức khỏe.</div>;
    return (
      <div className="mt-4">
        <h4 className="mb-3">Lịch sử khai báo sức khỏe</h4>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Ngày khai báo</th>
                <th>Mã học sinh</th>
                <th>Dị ứng</th>
                <th>Bệnh mãn tính</th>
                <th>Lịch sử điều trị</th>
                <th>Thị lực</th>
                <th>Thính lực</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {healthRecordHistory.map((record) => (
                <tr key={record.healthRecordId}>
                  <td>{new Date(record.recordDate).toLocaleDateString('vi-VN')}</td>
                  <td>{record.studentId}</td>
                  <td>{record.allergies || '-'}</td>
                  <td>{record.chronicDiseases || '-'}</td>
                  <td>{record.treatmentHistory || '-'}</td>
                  <td>{record.eyesight || '-'}</td>
                  <td>{record.hearing || '-'}</td>
                  <td>{record.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="main-container">
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title"><i className="fas fa-file-medical me-2"></i>Khai báo sức khỏe</h1>
          <p className="page-subtitle">Theo dõi và quản lý tình trạng sức khỏe học sinh</p>
        </div>
        <div className="content-layout">
          <div className="main-panel">
            <div className="panel-header"><i className="fas fa-clipboard-check me-2"></i>Form khai báo sức khỏe</div>
            <div className="panel-content">
              {alerts.success && (
                <div className="alert alert-success" style={{marginBottom: '1rem'}}>
                  <i className="fas fa-check-circle me-2"></i> Khai báo sức khỏe đã được ghi nhận thành công!
                </div>
              )}
              <form onSubmit={handleSubmit} className="health-declaration-form">
                <div className="form-section">
                  <h3 className="section-title"><i className="fas fa-user me-2"></i>Thông tin học sinh</h3>
                  <div className="row mb-4">
                    <div className="col-md-3">
                      <label htmlFor="studentId" className="form-label mb-2">Mã học sinh <span className="required">*</span></label>
                      <input type="text" id="studentId" name="studentId" className="form-control" placeholder="Nhập mã học sinh" value={formData.studentId} onChange={handleChange} required />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="studentName" className="form-label mb-2">Họ và tên <span className="required">*</span></label>
                      <input type="text" id="studentName" name="studentName" className="form-control" placeholder="Nhập họ và tên" value={formData.studentName} onChange={handleChange} required />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="studentClass" className="form-label mb-2">Lớp <span className="required">*</span></label>
                      <select id="studentClass" name="studentClass" className="form-select" value={formData.studentClass} onChange={handleChange} required>
                        <option value="">Chọn lớp</option>
                        <option value="10A1">10A1</option>
                        <option value="10A2">10A2</option>
                        <option value="10B1">10B1</option>
                        <option value="11A1">11A1</option>
                        <option value="11A2">11A2</option>
                        <option value="11B1">11B1</option>
                        <option value="12A1">12A1</option>
                        <option value="12A2">12A2</option>
                        <option value="12B1">12B1</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="recordDate" className="form-label mb-2">Ngày khai báo <span className="required">*</span></label>
                      <input type="date" id="recordDate" name="recordDate" className="form-control" value={formData.recordDate} onChange={handleChange} required />
                    </div>
                  </div>
                </div>
                <div className="form-section">
                  <h3 className="section-title"><i className="fas fa-notes-medical me-2"></i>Thông tin sức khỏe</h3>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="allergies" className="form-label mb-2">Dị ứng (nếu có)</label>
                      <textarea id="allergies" name="allergies" className="form-control" placeholder="Ghi rõ các dị ứng mà học sinh mắc phải" value={formData.allergies || ''} onChange={handleChange} rows="2"></textarea>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="chronicDiseases" className="form-label mb-2">Bệnh mãn tính (nếu có)</label>
                      <textarea id="chronicDiseases" name="chronicDiseases" className="form-control" placeholder="Ghi rõ các bệnh mãn tính mà học sinh mắc phải" value={formData.chronicDiseases || ''} onChange={handleChange} rows="2"></textarea>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="treatmentHistory" className="form-label mb-2">Lịch sử điều trị (nếu có)</label>
                      <textarea id="treatmentHistory" name="treatmentHistory" className="form-control" placeholder="Ghi rõ lịch sử điều trị các bệnh" value={formData.treatmentHistory || ''} onChange={handleChange} rows="2"></textarea>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="vaccinationHistory" className="form-label mb-2">Lịch sử tiêm chủng (nếu có)</label>
                      <textarea id="vaccinationHistory" name="vaccinationHistory" className="form-control" placeholder="Ghi rõ các vaccine đã tiêm" value={formData.vaccinationHistory || ''} onChange={handleChange} rows="2"></textarea>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-4">
                      <label htmlFor="eyesight" className="form-label mb-2">Thị lực</label>
                      <input type="text" id="eyesight" name="eyesight" className="form-control" placeholder="VD: 10/10, 8/10" value={formData.eyesight || ''} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="hearing" className="form-label mb-2">Thính lực</label>
                      <input type="text" id="hearing" name="hearing" className="form-control" placeholder="VD: Bình thường, Kém" value={formData.hearing || ''} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="parentContact" className="form-label mb-2">Liên hệ phụ huynh</label>
                      <input type="text" id="parentContact" name="parentContact" className="form-control" placeholder="Số điện thoại liên hệ" value={formData.parentContact || ''} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-12">
                      <label htmlFor="note" className="form-label mb-2">Ghi chú thêm</label>
                      <textarea id="note" name="note" className="form-control" placeholder="Mô tả thêm về tình trạng sức khỏe hoặc các vấn đề khác" value={formData.note || ''} onChange={handleChange} rows="2"></textarea>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <label className="custom-checkbox-label" htmlFor="parentalConsent">
                        <input
                          type="checkbox"
                          id="parentalConsent"
                          name="parentalConsent"
                          checked={!!formData.parentalConsent}
                          onChange={e => setFormData(prev => ({ ...prev, parentalConsent: e.target.checked }))}
                          style={{ display: 'none' }}
                        />
                        <span className={`custom-checkbox ${formData.parentalConsent ? 'checked' : ''}`}>{formData.parentalConsent ? '✗' : ''}</span>
                        Tôi xác nhận thông tin khai báo là chính xác và đồng ý để trường theo dõi sức khỏe
                      </label>
                    </div>
                  </div>
                </div>
                <div className="alert alert-info mb-4">
                  <div className="alert-content">
                    <i className="fas fa-info-circle me-2"></i>
                    <span>Vui lòng kiểm tra kỹ thông tin trước khi gửi. Thông tin sức khỏe sẽ được bảo mật theo quy định của nhà trường.</span>
                  </div>
                </div>
                <div className="action-buttons">
                  <button type="submit" className="btn btn-primary px-4 py-2"><i className="fas fa-save me-2"></i> Gửi khai báo</button>
                  <button type="button" className="btn btn-secondary px-4 py-2" onClick={() => setFormData({ studentId: '', studentName: '', studentClass: '', recordDate: new Date().toISOString().split('T')[0], allergies: '', chronicDiseases: '', treatmentHistory: '', eyesight: '', hearing: '', vaccinationHistory: '', note: '', parentContact: '', parentId: localStorage.getItem('userId') || '', parentalConsent: false })}><i className="fas fa-undo me-2"></i> Làm lại</button>
                </div>
              </form>
              <HealthRecordHistory />
            </div>
          </div>
          <div className="side-panel">
            <div className="alert alert-warning mb-3">
              <h4 className="mb-2" style={{ color: "#92400e", fontWeight: 600 }}><i className="fas fa-exclamation-triangle me-2"></i> Lưu ý quan trọng</h4>
              <ul style={{ listStyle: "none", padding: 0, fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 0 }}>
                <li><i className="fas fa-angle-right me-2"></i> Khai báo này được gửi trực tiếp đến hệ thống quản lý y tế của trường.</li>
                <li><i className="fas fa-angle-right me-2"></i> Hãy cập nhật tình trạng sức khỏe hàng ngày để được theo dõi hiệu quả.</li>
              </ul>
            </div>
            <div className="contact-box p-3 mt-4">
              <h4 className="mb-2" style={{ fontWeight: 600 }}><i className="fas fa-phone me-2"></i> Liên hệ khẩn cấp</h4>
              <p className="mb-1" style={{ fontWeight: 600 }}>Y tế trường: 024-xxxx-xxxx</p>
              <p className="mb-0" style={{ fontSize: "0.9rem" }}>Hotline 24/7: 1900-xxxx</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HealthDeclaration;
