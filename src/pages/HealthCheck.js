import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import './HealthCheck.css'; // Add a CSS file for styling

const HealthCheck = () => {
  const [healthChecks, setHealthChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Corrected API endpoint based on project structure
        const response = await apiClient.get('/HealthCheck'); 
        setHealthChecks(response.data);
      } catch (err) {
        setError('Lỗi khi tải dữ liệu khám sức khỏe. Vui lòng thử lại sau.');
        console.error("Fetch Health Checks Error:", err);
        setHealthChecks([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="health-check-container loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="health-check-container error">{error}</div>;
  }

  return (
    <div className="health-check-container">
      <h1>Danh sách Lịch khám sức khỏe</h1>
      {healthChecks.length > 0 ? (
        <ul className="health-check-list">
          {healthChecks.map((check) => (
            <li key={check.id} className="health-check-item">
              <h2>{check.patientName} - {check.class}</h2>
              <p><strong>Ngày khám:</strong> {new Date(check.date).toLocaleDateString()}</p>
              <p><strong>Loại khám:</strong> {check.checkupType}</p>
              <p><strong>Trạng thái:</strong> {check.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-data">Không có dữ liệu khám sức khỏe.</p>
      )}
    </div>
  );
};

export default HealthCheck; 