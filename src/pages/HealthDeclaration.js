import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HealthDeclaration.css';

const HealthDeclaration = () => {
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

  useEffect(() => {
    // Set current date as default
    setFormData(prev => ({
      ...prev,
      declarationDate: new Date().toISOString().split('T')[0]
    }));
    
    // Check authentication
    const checkAuth = () => {
      const user = localStorage.getItem('healthConnectUser');
      if (!user) {
        window.location.href = '/login';
      }
    };
    
    checkAuth();
  }, []);

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
        <div className="page-header">
          <h1 className="page-title">
            <i className="fas fa-file-medical"></i>
            Khai báo sức khỏe hàng ngày
          </h1>
          <p className="page-subtitle">Theo dõi và quản lý tình trạng sức khỏe học sinh một cách chi tiết và chính xác</p>
        </div>

        {/* Content Layout */}
        <div className="content-layout">
          {/* Main Panel */}
          <div className="main-panel">
            <div className="panel-header">
              <i className="fas fa-clipboard-check"></i>
              Form khai báo sức khỏe
            </div>
            <div className="panel-content">
              {/* Alert Messages */}
              {alerts.success && (
                <div className="alert alert-success">
                  <i className="fas fa-check-circle"></i>
                  Khai báo sức khỏe đã được ghi nhận thành công!
                </div>
              )}

              {alerts.warning && (
                <div className="alert alert-warning">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>{alerts.warningMessage}</span>
                </div>
              )}

              {/* Health Status Indicator */}
              <div className={`health-status status-${healthStatus.status}`}>
                <i className="fas fa-heart"></i>
                {healthStatus.message}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Student Information */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-user"></i>
                    Thông tin học sinh
                  </h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="studentId" className="form-label">Mã học sinh <span className="required">*</span></label>
                      <input 
                        type="text" 
                        id="studentId" 
                        name="studentId" 
                        className="form-input" 
                        placeholder="Nhập mã học sinh" 
                        value={formData.studentId}
                        onChange={handleChange}
                        onBlur={handleStudentIdBlur}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="studentName" className="form-label">Họ và tên <span className="required">*</span></label>
                      <input 
                        type="text" 
                        id="studentName" 
                        name="studentName" 
                        className="form-input" 
                        placeholder="Nhập họ và tên" 
                        value={formData.studentName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="studentClass" className="form-label">Lớp <span className="required">*</span></label>
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
                    <div className="form-group">
                      <label htmlFor="declarationDate" className="form-label">Ngày khai báo <span className="required">*</span></label>
                      <input 
                        type="date" 
                        id="declarationDate" 
                        name="declarationDate" 
                        className="form-input" 
                        value={formData.declarationDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Health Measurements */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-thermometer-half"></i>
                    Chỉ số sức khỏe
                  </h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="temperature" className="form-label">Nhiệt độ cơ thể (°C) <span className="required">*</span></label>
                      <input 
                        type="number" 
                        id="temperature" 
                        name="temperature" 
                        className="form-input" 
                        placeholder="VD: 36.5" 
                        step="0.1" 
                        min="35" 
                        max="42" 
                        value={formData.temperature}
                        onChange={handleChange}
                        required
                      />
                      <div className="temperature-scale">
                        <span>35°C</span>
                        <span style={{ color: "var(--success-green)" }}>36-37°C (Bình thường)</span>
                        <span>42°C</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="heartRate" className="form-label">Nhịp tim (lần/phút)</label>
                      <input 
                        type="number" 
                        id="heartRate" 
                        name="heartRate" 
                        className="form-input" 
                        placeholder="VD: 80" 
                        min="50" 
                        max="150"
                        value={formData.heartRate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="bloodPressure" className="form-label">Huyết áp (mmHg)</label>
                      <input 
                        type="text" 
                        id="bloodPressure" 
                        name="bloodPressure" 
                        className="form-input" 
                        placeholder="VD: 120/80" 
                        pattern="[0-9]{2,3}/[0-9]{2,3}"
                        value={formData.bloodPressure}
                        onChange={handleBloodPressureInput}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="weight" className="form-label">Cân nặng (kg)</label>
                      <input 
                        type="number" 
                        id="weight" 
                        name="weight" 
                        className="form-input" 
                        placeholder="VD: 50" 
                        step="0.1" 
                        min="20" 
                        max="150"
                        value={formData.weight}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Symptoms Check */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-stethoscope"></i>
                    Triệu chứng và tình trạng sức khỏe
                  </h3>
                  
                  <div className="form-group">
                    <label className="form-label">Bạn có gặp phải các triệu chứng sau không?</label>
                    <div className="checkbox-group">
                      <label className={`checkbox-item ${checkedItems.symptoms.fever ? 'checked' : ''}`}>
                        <input 
                          type="checkbox" 
                          name="symptoms" 
                          value="fever"
                          checked={checkedItems.symptoms.fever || false}
                          onChange={handleChange}
                        />
                        <span>Sốt, ớn lạnh</span>
                      </label>
                      <label className={`checkbox-item ${checkedItems.symptoms.cough ? 'checked' : ''}`}>
                        <input 
                          type="checkbox" 
                          name="symptoms" 
                          value="cough"
                          checked={checkedItems.symptoms.cough || false}
                          onChange={handleChange}
                        />
                        <span>Ho, khó thở</span>
                      </label>
                      <label className={`checkbox-item ${checkedItems.symptoms.headache ? 'checked' : ''}`}>
                        <input 
                          type="checkbox" 
                          name="symptoms" 
                          value="headache"
                          checked={checkedItems.symptoms.headache || false}
                          onChange={handleChange}
                        />
                        <span>Đau đầu, chóng mặt</span>
                      </label>
                      <label className={`checkbox-item ${checkedItems.symptoms.fatigue ? 'checked' : ''}`}>
                        <input 
                          type="checkbox" 
                          name="symptoms" 
                          value="fatigue"
                          checked={checkedItems.symptoms.fatigue || false}
                          onChange={handleChange}
                        />
                        <span>Mệt mỏi, yếu sức</span>
                      </label>
                      <label className={`checkbox-item ${checkedItems.symptoms.nausea ? 'checked' : ''}`}>
                        <input 
                          type="checkbox" 
                          name="symptoms" 
                          value="nausea"
                          checked={checkedItems.symptoms.nausea || false}
                          onChange={handleChange}
                        />
                        <span>Buồn nôn, nôn mửa</span>
                      </label>
                      <label className={`checkbox-item ${checkedItems.symptoms.stomach_pain ? 'checked' : ''}`}>
                        <input 
                          type="checkbox" 
                          name="symptoms" 
                          value="stomach_pain"
                          checked={checkedItems.symptoms.stomach_pain || false}
                          onChange={handleChange}
                        />
                        <span>Đau bụng, tiêu chảy</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="sleepQuality" className="form-label">Chất lượng giấc ngủ đêm qua</label>
                    <div className="radio-group">
                      <label className={`radio-item ${checkedItems.sleepQuality === 'very_good' ? 'checked' : ''}`}>
                        <input 
                          type="radio" 
                          name="sleepQuality" 
                          value="very_good"
                          checked={formData.sleepQuality === 'very_good'}
                          onChange={handleChange}
                        />
                        <span>Rất tốt (8+ giờ)</span>
                      </label>
                      <label className={`radio-item ${checkedItems.sleepQuality === 'good' ? 'checked' : ''}`}>
                        <input 
                          type="radio" 
                          name="sleepQuality" 
                          value="good"
                          checked={formData.sleepQuality === 'good'}
                          onChange={handleChange}
                        />
                        <span>Tốt (6-8 giờ)</span>
                      </label>
                      <label className={`radio-item ${checkedItems.sleepQuality === 'fair' ? 'checked' : ''}`}>
                        <input 
                          type="radio" 
                          name="sleepQuality" 
                          value="fair"
                          checked={formData.sleepQuality === 'fair'}
                          onChange={handleChange}
                        />
                        <span>Bình thường (4-6 giờ)</span>
                      </label>
                      <label className={`radio-item ${checkedItems.sleepQuality === 'poor' ? 'checked' : ''}`}>
                        <input 
                          type="radio" 
                          name="sleepQuality" 
                          value="poor"
                          checked={formData.sleepQuality === 'poor'}
                          onChange={handleChange}
                        />
                        <span>Kém ({'<'} 4 giờ)</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="appetiteLevel" className="form-label">Mức độ ăn uống</label>
                    <select 
                      id="appetiteLevel" 
                      name="appetiteLevel" 
                      className="form-select"
                      value={formData.appetiteLevel}
                      onChange={handleChange}
                    >
                      <option value="">Chọn mức độ</option>
                      <option value="excellent">Rất tốt - Ăn ngon miệng</option>
                      <option value="good">Tốt - Ăn bình thường</option>
                      <option value="fair">Bình thường - Ăn ít hơn</option>
                      <option value="poor">Kém - Chán ăn</option>
                      <option value="very_poor">Rất kém - Không muốn ăn</option>
                    </select>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-notes-medical"></i>
                    Thông tin bổ sung
                  </h3>
                  
                  <div className="form-group">
                    <label htmlFor="medications" className="form-label">Thuốc đang sử dụng (nếu có)</label>
                    <textarea 
                      id="medications" 
                      name="medications" 
                      className="form-textarea" 
                      placeholder="Ghi rõ tên thuốc, liều lượng và mục đích sử dụng"
                      value={formData.medications}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="additionalNotes" className="form-label">Ghi chú thêm</label>
                    <textarea 
                      id="additionalNotes" 
                      name="additionalNotes" 
                      className="form-textarea" 
                      placeholder="Mô tả thêm về tình trạng sức khỏe hoặc các vấn đề khác"
                      value={formData.additionalNotes}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-item" style={{ justifyContent: "flex-start" }}>
                      <input 
                        type="checkbox" 
                        id="parentalConsent" 
                        name="parentalConsent"
                        checked={formData.parentalConsent}
                        onChange={handleChange}
                        required
                      />
                      <span>Tôi xác nhận thông tin khai báo là chính xác và đồng ý để trường theo dõi sức khỏe</span>
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save"></i> Gửi khai báo
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleReset}>
                    <i className="fas fa-undo"></i> Làm lại
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Side Panel */}
          <div className="side-panel">
            <div className="quick-guide">
              <h4><i className="fas fa-info-circle"></i> Hướng dẫn khai báo</h4>
              <div className="guide-item">
                <i className="fas fa-check"></i>
                <span>Điền đầy đủ thông tin bắt buộc</span>
              </div>
              <div className="guide-item">
                <i className="fas fa-check"></i>
                <span>Đo nhiệt độ chính xác trước khi khai báo</span>
              </div>
              <div className="guide-item">
                <i className="fas fa-check"></i>
                <span>Báo cáo trung thực các triệu chứng</span>
              </div>
              <div className="guide-item">
                <i className="fas fa-check"></i>
                <span>Thông báo ngay nếu có triệu chứng bất thường</span>
              </div>
            </div>

            <div style={{ background: "var(--gray-50)", padding: "1.5rem", borderRadius: "12px", marginBottom: "1.5rem" }}>
              <h4 style={{ color: "var(--primary-blue)", marginBottom: "1rem" }}>
                <i className="fas fa-exclamation-triangle"></i> Lưu ý quan trọng
              </h4>
              <ul style={{ listStyle: "none", padding: 0, fontSize: "0.9rem", lineHeight: 1.6 }}>
                <li style={{ marginBottom: "0.5rem" }}>• Nhiệt độ ≥ 37.5°C: Cần theo dõi đặc biệt</li>
                <li style={{ marginBottom: "0.5rem" }}>• Có triệu chứng ho, khó thở: Liên hệ y tế ngay</li>
                <li style={{ marginBottom: "0.5rem" }}>• Đau bụng dữ dội: Cần hỗ trợ y tế</li>
                <li>• Chóng mặt, ngất xỉu: Báo cáo khẩn cấp</li>
              </ul>
            </div>

            <div style={{ background: "linear-gradient(135deg, var(--success-green), #059669)", color: "white", padding: "1.5rem", borderRadius: "12px", textAlign: "center" }}>
              <h4 style={{ marginBottom: "1rem" }}>
                <i className="fas fa-phone"></i> Liên hệ khẩn cấp
              </h4>
              <p style={{ marginBottom: "0.5rem", fontWeight: 600 }}>Y tế trường: 024-xxxx-xxxx</p>
              <p style={{ fontSize: "0.9rem" }}>Hotline 24/7: 1900-xxxx</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HealthDeclaration;
