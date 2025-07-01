import React, { useState } from 'react';
import { createHealthCheckResult, updateHealthCheckResult } from '../services/healthCheckService';

function HealthCheckResultForm({ consentFormId, existingResult, onSuccess }) {
  const [resultData, setResultData] = useState(
    existingResult || {
      height: '',
      weight: '',
      resultStatus: 'Completed',
      reasonForCancellation: '',
      checkUpDate: ''
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResultData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      healthCheckConsentID: consentFormId,
      ...resultData,
      checkUpDate: resultData.checkUpDate ? new Date(resultData.checkUpDate).toISOString().split('T')[0] : undefined
    };

    if (existingResult) {
      await updateHealthCheckResult(existingResult.ID, dataToSend);
    } else {
      await createHealthCheckResult(dataToSend);
    }
    onSuccess && onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="health-check-result-form">
      <div className="form-group">
        <label>Trạng thái</label>
        <select
          name="resultStatus"
          value={resultData.resultStatus}
          onChange={handleInputChange}
        >
          <option value="Completed">Hoàn thành</option>
          <option value="FollowUp">Theo dõi sau khám</option>
          <option value="Cancelled">Đã bị hủy</option>
        </select>
      </div>
      
      {resultData.resultStatus === 'Cancelled' && (
        <div className="form-group">
          <label>Lý do hủy</label>
          <textarea
            name="reasonForCancellation"
            value={resultData.reasonForCancellation}
            onChange={handleInputChange}
            placeholder="Nhập lý do hủy (ví dụ: học sinh không đến khám)..."
          />
        </div>
      )}

      {resultData.resultStatus !== 'Cancelled' && (
        <>
          <div className="form-group">
            <label>Chiều cao (cm)</label>
            <input
              type="number"
              name="height"
              value={resultData.height}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Cân nặng (kg)</label>
            <input
              type="number"
              name="weight"
              value={resultData.weight}
              onChange={handleInputChange}
            />
          </div>
          {/* Thêm các trường kết quả khám khác ở đây */}
        </>
      )}

      <button type="submit" className="submit-btn">Lưu kết quả</button>
    </form>
  );
}

export default HealthCheckResultForm; 