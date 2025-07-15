import React, { useState, useEffect } from 'react';
import { createHealthCheckResult, updateHealthCheckResult } from '../services/healthCheckService';
import './HealthCheckResultForm.css';

function generateId() {
  // Sinh ID dạng HR + 4 số ngẫu nhiên, ví dụ: HR1234
  return 'HR' + Math.floor(1000 + Math.random() * 9000);
}

function HealthCheckResultForm({ consentFormId, existingResult, onSuccess, onCancel, checkUpType, checker }) {
  // Lấy ngày hiện tại yyyy-MM-dd
  const today = new Date().toISOString().split('T')[0];
  const defaultResult = {
    height: '',
    weight: '',
    bloodPressure: '',
    heartRate: '',
    eyesight: '',
    hearing: '',
    oralHealth: '',
    spine: '',
    conclusion: '',
    checkUpDate: today,
    checker: checker || '',
    needToContactParent: false,
    followUpDate: '',
    status: '',
    healthFacility: 'Phòng Y Tế Trường',
    checkUpType: checkUpType || '',
  };
  const [resultData, setResultData] = useState({
    ...defaultResult,
    ...existingResult
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setResultData(prev => ({
      ...prev,
      checkUpDate: today,
      healthFacility: 'Phòng Y Tế Trường',
      checkUpType: checkUpType || '',
      checker: checker || prev.checker
    }));
    // eslint-disable-next-line
  }, [checkUpType, checker]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setResultData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Generate ID for new records
    const recordId = existingResult && (existingResult.ID || existingResult.id) 
      ? (existingResult.ID || existingResult.id) 
      : generateId();
    
    const payload = {
      ID: recordId,
      HealthCheckConsentID: consentFormId,
      Height: resultData.height ? Number(resultData.height) : null,
      Weight: resultData.weight ? Number(resultData.weight) : null,
      BloodPressure: resultData.bloodPressure ? Number(resultData.bloodPressure) : null,
      HeartRate: resultData.heartRate ? Number(resultData.heartRate) : null,
      Eyesight: resultData.eyesight || null,
      Hearing: resultData.hearing || null,
      OralHealth: resultData.oralHealth || null,
      Spine: resultData.spine || null,
      Conclusion: resultData.conclusion || null,
      CheckUpDate: resultData.checkUpDate ? new Date(resultData.checkUpDate).toISOString() : new Date().toISOString(),
      Checker: resultData.checker || null,
      NeedToContactParent: resultData.needToContactParent || false,
      FollowUpDate: resultData.followUpDate ? new Date(resultData.followUpDate).toISOString() : null,
      Status: resultData.status || null,
      HealthFacility: resultData.healthFacility || null,
      CheckupType: resultData.checkUpType || null
    };
    
    console.log('DATA TO SEND:', payload);
    console.log('ConsentFormId:', consentFormId);
    
    try {
      await createHealthCheckResult(payload);
      onSuccess && onSuccess();
    } catch (error) {
      console.error('Error creating health check result:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      if (error.response) {
        const errorMessage = error.response.data 
          ? (typeof error.response.data === 'string' 
              ? error.response.data 
              : JSON.stringify(error.response.data))
          : `HTTP ${error.response.status}: ${error.response.statusText}`;
        alert('Lỗi lưu kết quả: ' + errorMessage);
      } else {
        alert('Lỗi không xác định: ' + error.message);
      }
      return;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay result-modal">
      <div className="modal-content">
        <div className="modal-title">NHẬP KẾT QUẢ KHÁM SỨC KHỎE</div>
        <form onSubmit={handleSubmit} className="health-check-result-form center-form">
          <table className="result-table">
            <tbody>
              <tr>
                <td className="label-cell">Chiều cao (cm) <span className="required-star">*</span></td>
                <td><input type="number" name="height" value={resultData.height} onChange={handleInputChange} className="input-cell" required /></td>
              </tr>
              <tr>
                <td className="label-cell">Cân nặng (kg) <span className="required-star">*</span></td>
                <td><input type="number" name="weight" value={resultData.weight} onChange={handleInputChange} className="input-cell" required /></td>
              </tr>
              <tr>
                <td className="label-cell">Huyết áp <span className="required-star">*</span></td>
                <td><input type="number" name="bloodPressure" value={resultData.bloodPressure} onChange={handleInputChange} className="input-cell" required /></td>
              </tr>
              <tr>
                <td className="label-cell">Nhịp tim <span className="required-star">*</span></td>
                <td><input type="number" name="heartRate" value={resultData.heartRate} onChange={handleInputChange} className="input-cell" required /></td>
              </tr>
              <tr>
                <td className="label-cell">Thị lực <span className="required-star">*</span></td>
                <td><input type="text" name="eyesight" value={resultData.eyesight} onChange={handleInputChange} className="input-cell" required /></td>
              </tr>
              <tr>
                <td className="label-cell">Thính lực <span className="required-star">*</span></td>
                <td><input type="text" name="hearing" value={resultData.hearing} onChange={handleInputChange} className="input-cell" required /></td>
              </tr>
              <tr>
                <td className="label-cell">Răng miệng <span className="required-star">*</span></td>
                <td><input type="text" name="oralHealth" value={resultData.oralHealth} onChange={handleInputChange} className="input-cell" required /></td>
              </tr>
              <tr>
                <td className="label-cell">Cột sống <span className="required-star">*</span></td>
                <td><input type="text" name="spine" value={resultData.spine} onChange={handleInputChange} className="input-cell" required /></td>
              </tr>
              <tr>
                <td className="label-cell">Kết luận <span className="required-star">*</span></td>
                <td><input type="text" name="conclusion" value={resultData.conclusion} onChange={handleInputChange} className="input-cell" required /></td>
              </tr>
              <tr>
                <td className="label-cell">Ngày khám <span className="required-star">*</span></td>
                <td><input type="text" name="checkUpDate" value={today} readOnly className="input-cell" /></td>
              </tr>
              <tr>
                <td className="label-cell">Người khám <span className="required-star">*</span></td>
                <td><input type="text" name="checker" value={resultData.checker} onChange={handleInputChange} className="input-cell" required /></td>
              </tr>
              <tr>
                <td className="label-cell">Cần liên hệ phụ huynh</td>
                <td><input type="checkbox" name="needToContactParent" checked={resultData.needToContactParent} onChange={handleInputChange} /></td>
              </tr>
              {resultData.needToContactParent && (
                <tr>
                  <td className="label-cell">Ngày hẹn tái khám</td>
                  <td><input type="date" name="followUpDate" value={resultData.followUpDate} onChange={handleInputChange} className="input-cell" /></td>
                </tr>
              )}
              <tr>
                <td className="label-cell">Trạng thái</td>
                <td><input type="text" name="status" value={resultData.status} onChange={handleInputChange} className="input-cell" /></td>
              </tr>
              <tr>
                <td className="label-cell">Cơ sở khám</td>
                <td><input type="text" name="healthFacility" value={resultData.healthFacility} readOnly className="input-cell" /></td>
              </tr>
              <tr>
                <td className="label-cell">Loại khám</td>
                <td><input type="text" name="checkUpType" value={resultData.checkUpType} readOnly className="input-cell" /></td>
              </tr>
            </tbody>
          </table>
          <div className="modal-actions center-actions">
            <button type="submit" className="submit-btn">Lưu kết quả</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HealthCheckResultForm; 