import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './HealthRecord.css';

const VaccinationPlanStudents = () => {
  const { id: planId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await apiClient.get(`/VaccinationConsentForm/plan/${planId}`);
        // Lọc các học sinh đã xác nhận
        const confirmed = res.data.filter(f => f.consentStatus === "Approved" && f.studentID);
        // Lấy thông tin profile cho từng studentID (UserID)
        const studentProfiles = await Promise.all(
          confirmed.map(async (f) => {
            try {
              const profileRes = await apiClient.get(`/Profile/user/${f.studentID}`);
              return {
                userID: f.studentID,
                name: profileRes.data?.name || profileRes.data?.Name || 'Không rõ tên',
                classID: profileRes.data?.classID || profileRes.data?.ClassID || 'Không rõ',
              };
            } catch {
              return {
                userID: f.studentID,
                name: 'Không rõ tên',
                classID: 'Không rõ',
              };
            }
          })
        );
        setStudents(studentProfiles);
      } catch (err) {
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [planId]);

  return (
    <div className="main-container" style={{ minHeight: '80vh' }}>
      <div className="main-content">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <button
              onClick={() => navigate('/vaccination-management')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 8px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(102, 126, 234, 0.3)';
              }}
            >
              <i className="fas fa-arrow-left"></i>
              Quay lại
            </button>
            <div className="page-title">
              <i className="fas fa-user-check" style={{ color: 'var(--primary-blue)' }}></i>
              Danh sách học sinh đã xác nhận tiêm chủng
            </div>
          </div>
          <div className="page-subtitle">
            Chỉ hiển thị học sinh đã được phụ huynh xác nhận đồng ý tiêm chủng.
          </div>
        </div>
        <div className="main-panel" style={{ width: '100%', margin: 0, padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 32 }}>
              <div className="spinner-border text-primary" role="status" style={{ width: 48, height: 48, marginBottom: 12 }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <div>Đang tải dữ liệu...</div>
            </div>
          ) : students.length === 0 ? (
            <div className="alert alert-info" style={{ textAlign: 'center', fontSize: 18, padding: 32 }}>
              <i className="fas fa-user-times" style={{ fontSize: 32, color: '#cbd5e1', marginBottom: 8 }}></i>
              <div>Không có học sinh nào đã xác nhận tiêm chủng.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', padding: 0 }}>
              <table className="table table-hover" style={{ width: '100vw', borderCollapse: 'collapse', background: '#fff', borderRadius: 8 }}>
                <thead style={{ background: '#f1f5f9' }}>
                  <tr>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>STT</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Mã học sinh</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Họ tên</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Lớp</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr key={student?.userID || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 8px' }}>{idx + 1}</td>
                      <td style={{ padding: '10px 8px' }}>{student?.userID || 'Không rõ'}</td>
                      <td style={{ padding: '10px 8px' }}>{student?.name || 'Không rõ tên'}</td>
                      <td style={{ padding: '10px 8px' }}>{student?.classID || 'Không rõ'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaccinationPlanStudents; 