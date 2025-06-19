import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HealthDeclaration.css';

const HealthDeclaration = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  // Move all useState hooks to the top level
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    studentClass: '',
    declarationDate: new Date().toISOString().split('T')[0],
    temperature: '',
    heartRate: '',
    bloodPressure: '',
    weight: '',
    symptoms: [],
    sleepQuality: '',
    appetiteLevel: '',
    medications: '',
    additionalNotes: '',
    parentalConsent: false
  });

  const [healthStatus, setHealthStatus] = useState({
    status: 'good',
    message: 'Tình trạng sức khỏe: Bình thường'
  });

  const [alerts, setAlerts] = useState({
    success: false,
    warning: false,
    warningMessage: ''
  });

  const [checkedItems, setCheckedItems] = useState({
    symptoms: {},
    sleepQuality: ''
  });
  
  // Kiểm tra xác thực trực tiếp trong component
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("HealthDeclaration: Not authenticated, redirecting to login");
      navigate('/login', { 
        state: { 
          from: { pathname: '/health-declaration' },
          manualLogin: true 
        } 
      });
    }
  }, [isAuthenticated, loading, navigate]);
    useEffect(() => {
    // Set current date as default
    setFormData(prev => ({
      ...prev,
      declarationDate: new Date().toISOString().split('T')[0]
    }));
  }, []);
  
  // Đảm bảo rằng các input và select được hiển thị đúng khi form được render
  useEffect(() => {
    const fixFormElements = () => {
      // Fix cho các inputs
      const formElements = document.querySelectorAll('.form-control, .form-select');
      formElements.forEach(element => {
        element.style.backgroundColor = '#fff';
        element.style.color = '#212529';
        element.style.border = '1px solid #ced4da';
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
      });

      // Đảm bảo checkbox và radio hoạt động
      const checkboxRadios = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
      checkboxRadios.forEach(element => {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
      });
    };

    // Chạy hàm fixFormElements sau khi component mount
    fixFormElements();

    // Cũng chạy sau một khoảng thời gian ngắn (để đảm bảo tất cả các elements đã load)
    const timer = setTimeout(fixFormElements, 300);

    return () => clearTimeout(timer);
  }, []);
  
  // Nếu đang loading hoặc chưa đăng nhập, hiển thị thông báo loading
  if (loading || !isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '50px 0' }}>
        <div className="loading-spinner">Đang kiểm tra thông tin đăng nhập...</div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'parentalConsent') {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      } else {
        // Handle symptoms checkboxes
        const newSymptoms = [...formData.symptoms];
        
        if (checked) {
          newSymptoms.push(value);
        } else {
          const index = newSymptoms.indexOf(value);
          if (index > -1) {
            newSymptoms.splice(index, 1);
          }
        }
        
        setFormData(prev => ({
          ...prev,
          symptoms: newSymptoms
        }));
        
        // Update visual state
        setCheckedItems(prev => ({
          ...prev,
          symptoms: {
            ...prev.symptoms,
            [value]: checked
          }
        }));
        
        // Update health status based on symptoms
        updateHealthStatus(formData.temperature, newSymptoms);
      }
    } else if (type === 'radio') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Update visual state for radio buttons
      if (name === 'sleepQuality') {
        setCheckedItems(prev => ({
          ...prev,
          sleepQuality: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Update health status if temperature changes
      if (name === 'temperature') {
        updateHealthStatus(value, formData.symptoms);
      }
    }
  };

  // Auto-fill student name based on ID
  const handleStudentIdBlur = (e) => {
    const studentId = e.target.value.trim();
    const nameField = formData.studentName;
    
    // Demo data mapping
    const studentNames = {
      'HS001': 'Nguyễn Văn An',
      'HS002': 'Trần Thị Bình',
      'HS003': 'Lê Minh Châu',
      'HS004': 'Phạm Thị Dương',
      'HS005': 'Hoàng Văn Em'
    };
    
    if (studentNames[studentId] && !nameField) {
      setFormData(prev => ({
        ...prev,
        studentName: studentNames[studentId]
      }));
    }
  };

  // Blood pressure format validation
  const handleBloodPressureInput = (e) => {
    let value = e.target.value.replace(/[^\\d\\/]/g, '');
    if (value.includes('/')) {
      const parts = value.split('/');
      if (parts.length === 2) {
        value = parts[0] + '/' + parts[1];
      }
    }
    setFormData(prev => ({
      ...prev,
      bloodPressure: value
    }));
  };

  // Health status assessment
  const updateHealthStatus = (temperature, symptoms) => {
    const temp = parseFloat(temperature);
    let status = 'good';
    let message = 'Tình trạng sức khỏe: Bình thường';
    let warnings = [];
    let showWarning = false;

    // Temperature check
    if (temp >= 37.5) {
      status = 'danger';
      message = 'Cảnh báo: Sốt cao - Cần theo dõi đặc biệt';
      warnings.push('Nhiệt độ cao (≥37.5°C)');
      showWarning = true;
    } else if (temp >= 37.0) {
      status = 'warning';
      message = 'Chú ý: Nhiệt độ hơi cao - Cần theo dõi';
      warnings.push('Nhiệt độ hơi cao');
      showWarning = true;
    }

    // Symptoms check
    const criticalSymptoms = ['fever', 'cough', 'stomach_pain'];
    const hasCriticalSymptoms = symptoms.some(s => criticalSymptoms.includes(s));
    
    if (hasCriticalSymptoms) {
      if (status === 'good') status = 'warning';
      if (symptoms.includes('fever')) warnings.push('Sốt, ớn lạnh');
      if (symptoms.includes('cough')) warnings.push('Ho, khó thở');
      if (symptoms.includes('stomach_pain')) warnings.push('Đau bụng');
      
      if (status !== 'danger') {
        message = 'Chú ý: Có triệu chứng cần theo dõi';
      }
      showWarning = true;
    }

    // Update state
    setHealthStatus({
      status,
      message
    });

    setAlerts(prev => ({
      ...prev,
      warning: showWarning,
      warningMessage: warnings.length > 0 ? 
        `Phát hiện: ${warnings.join(', ')}. Vui lòng liên hệ y tế trường!` : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.studentId || !formData.studentName || !formData.studentClass || !formData.temperature) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc!');
      return;
    }

    // Create declaration object
    const declaration = {
      id: Date.now(),
      ...formData,
      temperature: parseFloat(formData.temperature),
      heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const healthDeclarations = JSON.parse(localStorage.getItem('healthDeclarations') || '[]');
    healthDeclarations.unshift(declaration);
    localStorage.setItem('healthDeclarations', JSON.stringify(healthDeclarations));

    // Show success message
    setAlerts(prev => ({
      ...prev,
      success: true,
      warning: false
    }));

    // Reset form
    setFormData({
      studentId: '',
      studentName: '',
      studentClass: '',
      declarationDate: new Date().toISOString().split('T')[0],
      temperature: '',
      heartRate: '',
      bloodPressure: '',
      weight: '',
      symptoms: [],
      sleepQuality: '',
      appetiteLevel: '',
      medications: '',
      additionalNotes: '',
      parentalConsent: false
    });

    // Reset visual states
    setCheckedItems({
      symptoms: {},
      sleepQuality: ''
    });

    // Reset health status
    setHealthStatus({
      status: 'good',
      message: 'Tình trạng sức khỏe: Bình thường'
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Auto hide success message after 5 seconds
    setTimeout(() => {
      setAlerts(prev => ({
        ...prev,
        success: false
      }));
    }, 5000);
  };

  const handleReset = () => {
    // Reset form
    setFormData({
      studentId: '',
      studentName: '',
      studentClass: '',
      declarationDate: new Date().toISOString().split('T')[0],
      temperature: '',
      heartRate: '',
      bloodPressure: '',
      weight: '',
      symptoms: [],
      sleepQuality: '',
      appetiteLevel: '',
      medications: '',
      additionalNotes: '',
      parentalConsent: false
    });

    // Reset visual states
    setCheckedItems({
      symptoms: {},
      sleepQuality: ''
    });

    // Reset health status
    setHealthStatus({
      status: 'good',
      message: 'Tình trạng sức khỏe: Bình thường'
    });

    // Reset alerts
    setAlerts({
      success: false,
      warning: false,
      warningMessage: ''
    });
  };

  return (
    <div className="main-container">
      <main className="main-content">
        {/* Page Header */}
        <div className="page-header">          <h1 className="page-title">
            <i className="fas fa-file-medical me-2"></i>
            Khai báo sức khỏe hàng ngày
          </h1>
          <p className="page-subtitle">Theo dõi và quản lý tình trạng sức khỏe học sinh một cách chi tiết và chính xác</p>
        </div>

        {/* Content Layout */}
        <div className="content-layout">
          {/* Main Panel */}
          <div className="main-panel">            <div className="panel-header">
              <i className="fas fa-clipboard-check me-2"></i>
              Form khai báo sức khỏe
            </div>
            <div className="panel-content">                {/* Alert Messages */}
                {alerts.success && (
                  <div className="alert alert-success">
                    <i className="fas fa-check-circle me-2"></i>
                    Khai báo sức khỏe đã được ghi nhận thành công!
                  </div>
                )}

                {alerts.warning && (
                  <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <span>{alerts.warningMessage}</span>
                  </div>
                )}

                {/* Health Status Indicator */}
                <div className={`health-status status-${healthStatus.status} mb-4`}>
                  <i className="fas fa-heart me-2"></i>
                  {healthStatus.message}
                </div>

              <form onSubmit={handleSubmit} className="health-declaration-form">                {/* Student Information */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-user me-2"></i>
                    Thông tin học sinh
                  </h3>
                  <div className="row mb-4">
                    <div className="col-md-3">
                      <label htmlFor="studentId" className="form-label mb-2">Mã học sinh <span className="required">*</span></label>
                      <div className="custom-select-wrapper">
                        <input 
                          type="text" 
                          id="studentId" 
                          name="studentId" 
                          className="form-control" 
                          placeholder="Nhập mã học sinh" 
                          value={formData.studentId}
                          onChange={handleChange}
                          onBlur={handleStudentIdBlur}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="studentName" className="form-label mb-2">Họ và tên <span className="required">*</span></label>
                      <input 
                        type="text" 
                        id="studentName" 
                        name="studentName" 
                        className="form-control" 
                        placeholder="Nhập họ và tên" 
                        value={formData.studentName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="studentClass" className="form-label mb-2">Lớp <span className="required">*</span></label>
                      <div className="custom-select-wrapper">
                        <select 
                          id="studentClass" 
                          name="studentClass" 
                          className="form-select" 
                          value={formData.studentClass}
                          onChange={handleChange}
                          required
                        >
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
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="declarationDate" className="form-label mb-2">Ngày khai báo <span className="required">*</span></label>
                      <input 
                        type="date" 
                        id="declarationDate" 
                        name="declarationDate" 
                        className="form-control" 
                        value={formData.declarationDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>{/* Health Measurements */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-thermometer-half me-2"></i>
                    Chỉ số sức khỏe
                  </h3>
                  <div className="row mb-4">
                    <div className="col-md-3">
                      <label htmlFor="temperature" className="form-label mb-2">Nhiệt độ cơ thể (°C) <span className="required">*</span></label>
                      <input 
                        type="number" 
                        id="temperature" 
                        name="temperature" 
                        className="form-control" 
                        placeholder="VD: 36.5" 
                        step="0.1" 
                        min="35" 
                        max="42" 
                        value={formData.temperature}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="heartRate" className="form-label mb-2">Nhịp tim (lần/phút)</label>
                      <input 
                        type="number" 
                        id="heartRate" 
                        name="heartRate" 
                        className="form-control" 
                        placeholder="VD: 80" 
                        min="50" 
                        max="150"
                        value={formData.heartRate}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="bloodPressure" className="form-label mb-2">Huyết áp (mmHg)</label>
                      <input 
                        type="text" 
                        id="bloodPressure" 
                        name="bloodPressure" 
                        className="form-control" 
                        placeholder="VD: 120/80" 
                        pattern="[0-9]{2,3}/[0-9]{2,3}"
                        value={formData.bloodPressure}
                        onChange={handleBloodPressureInput}
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="weight" className="form-label mb-2">Cân nặng (kg)</label>
                      <input 
                        type="number" 
                        id="weight" 
                        name="weight" 
                        className="form-control" 
                        placeholder="VD: 50" 
                        step="0.1" 
                        min="20" 
                        max="150"
                        value={formData.weight}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-12">
                      <div className="temperature-scale">
                        <span>35°C</span>
                        <span style={{ color: "var(--success-green)" }}>36-37°C (Bình thường)</span>
                        <span>42°C</span>
                      </div>
                    </div>
                  </div>
                </div>{/* Symptoms Check */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-stethoscope me-2"></i>
                    Triệu chứng và tình trạng sức khỏe
                  </h3>
                  <div className="symptoms-container">
                    <div className="row mb-2">
                      <div className="col-md-12">
                        <label className="form-label mb-2">Bạn có gặp phải các triệu chứng sau không?</label>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className={`checkbox-item ${checkedItems.symptoms.fever ? 'checked' : ''}`}>
                          <input 
                            type="checkbox" 
                            name="symptoms" 
                            value="fever"
                            checked={checkedItems.symptoms.fever || false}
                            onChange={handleChange}
                          />
                          <span className="ms-2">Sốt, ớn lạnh</span>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className={`checkbox-item ${checkedItems.symptoms.cough ? 'checked' : ''}`}>
                          <input 
                            type="checkbox" 
                            name="symptoms" 
                            value="cough"
                            checked={checkedItems.symptoms.cough || false}
                            onChange={handleChange}
                          />
                          <span className="ms-2">Ho, khó thở</span>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className={`checkbox-item ${checkedItems.symptoms.headache ? 'checked' : ''}`}>
                          <input 
                            type="checkbox" 
                            name="symptoms" 
                            value="headache"
                            checked={checkedItems.symptoms.headache || false}
                            onChange={handleChange}
                          />
                          <span className="ms-2">Đau đầu, chóng mặt</span>
                        </label>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col-md-4">
                        <label className={`checkbox-item ${checkedItems.symptoms.fatigue ? 'checked' : ''}`}>
                          <input 
                            type="checkbox" 
                            name="symptoms" 
                            value="fatigue"
                            checked={checkedItems.symptoms.fatigue || false}
                            onChange={handleChange}
                          />
                          <span className="ms-2">Mệt mỏi, yếu sức</span>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className={`checkbox-item ${checkedItems.symptoms.nausea ? 'checked' : ''}`}>
                          <input 
                            type="checkbox" 
                            name="symptoms" 
                            value="nausea"
                            checked={checkedItems.symptoms.nausea || false}
                            onChange={handleChange}
                          />
                          <span className="ms-2">Buồn nôn, nôn mửa</span>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className={`checkbox-item ${checkedItems.symptoms.stomach_pain ? 'checked' : ''}`}>
                          <input 
                            type="checkbox" 
                            name="symptoms" 
                            value="stomach_pain"
                            checked={checkedItems.symptoms.stomach_pain || false}
                            onChange={handleChange}
                          />
                          <span className="ms-2">Đau bụng, tiêu chảy</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>                {/* Additional Information */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-notes-medical me-2"></i>
                    Thông tin bổ sung
                  </h3>
                  
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="medications" className="form-label mb-2">Thuốc đang sử dụng (nếu có)</label>
                      <textarea 
                        id="medications" 
                        name="medications" 
                        className="form-control" 
                        placeholder="Ghi rõ tên thuốc, liều lượng và mục đích sử dụng"
                        value={formData.medications}
                        onChange={handleChange}
                        rows="3"
                      ></textarea>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="additionalNotes" className="form-label mb-2">Ghi chú thêm</label>
                      <textarea 
                        id="additionalNotes" 
                        name="additionalNotes" 
                        className="form-control" 
                        placeholder="Mô tả thêm về tình trạng sức khỏe hoặc các vấn đề khác"
                        value={formData.additionalNotes}
                        onChange={handleChange}
                        rows="3"
                      ></textarea>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-12">
                      <div className="form-check">
                        <input 
                          type="checkbox" 
                          className="form-check-input" 
                          id="parentalConsent" 
                          name="parentalConsent"
                          checked={formData.parentalConsent}
                          onChange={handleChange}
                          required
                        />
                        <label className="form-check-label" htmlFor="parentalConsent">
                          Tôi xác nhận thông tin khai báo là chính xác và đồng ý để trường theo dõi sức khỏe
                        </label>
                      </div>
                    </div>
                  </div>
                </div>{/* Alert Information */}
                <div className="alert alert-info mb-4">
                  <div className="alert-content">
                    <i className="fas fa-info-circle me-2"></i>
                    <span>Vui lòng kiểm tra kỹ thông tin trước khi gửi. Thông tin sức khỏe sẽ được bảo mật theo quy định của nhà trường.</span>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="action-buttons">
                  <button type="submit" className="btn btn-primary px-4 py-2">
                    <i className="fas fa-save me-2"></i> Gửi khai báo
                  </button>
                  <button type="button" className="btn btn-secondary px-4 py-2" onClick={handleReset}>
                    <i className="fas fa-undo me-2"></i> Làm lại
                  </button>
                </div>
              </form>
            </div>
          </div>          {/* Side Panel */}
          <div className="side-panel">
            <div className="quick-guide">
              <h4><i className="fas fa-info-circle me-2"></i> Hướng dẫn khai báo</h4>
              <div className="guide-item">
                <i className="fas fa-check me-2"></i>
                <span>Điền đầy đủ thông tin bắt buộc</span>
              </div>
              <div className="guide-item">
                <i className="fas fa-check me-2"></i>
                <span>Đo nhiệt độ chính xác trước khi khai báo</span>
              </div>
              <div className="guide-item">
                <i className="fas fa-check me-2"></i>
                <span>Báo cáo trung thực các triệu chứng</span>
              </div>
              <div className="guide-item">
                <i className="fas fa-check me-2"></i>
                <span>Thông báo ngay nếu có triệu chứng bất thường</span>
              </div>
            </div>

            <div className="alert alert-warning mb-3">
              <h4 className="mb-2" style={{ color: "#92400e", fontWeight: 600 }}>
                <i className="fas fa-exclamation-triangle me-2"></i> Lưu ý quan trọng
              </h4>
              <ul style={{ listStyle: "none", padding: 0, fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 0 }}>
                <li className="mb-1">• Nhiệt độ ≥ 37.5°C: Cần theo dõi đặc biệt</li>
                <li className="mb-1">• Có triệu chứng ho, khó thở: Liên hệ y tế ngay</li>
                <li className="mb-1">• Đau bụng dữ dội: Cần hỗ trợ y tế</li>
                <li>• Chóng mặt, ngất xỉu: Báo cáo khẩn cấp</li>
              </ul>
            </div>

            <div className="alert alert-success mb-0" style={{ textAlign: "center" }}>
              <h4 className="mb-2">
                <i className="fas fa-phone me-2"></i> Liên hệ khẩn cấp
              </h4>
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
