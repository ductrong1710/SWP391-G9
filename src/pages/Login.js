import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Redirect to dashboard
    navigate('/dashboard');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <div className="logo">
          <img src="/assets/healthconnect-logo.svg" alt="Logo" style={{ height: '72px', marginBottom: '16px' }} />
        </div>
        <div className="welcome-title">Chào mừng</div>
        <div className="portal-desc">Đăng nhập vào Cổng thông tin Y tế học đường</div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Tên đăng nhập</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              className="form-input" 
              placeholder="Nhập tên đăng nhập" 
              required 
              autoComplete="username"
              value={credentials.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Mật khẩu</label>
            <div className="password-wrapper">
              <input 
                type={passwordVisible ? "text" : "password"} 
                id="password" 
                name="password" 
                className="form-input" 
                placeholder="Nhập mật khẩu" 
                required 
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
              />
              <button 
                type="button" 
                className="show-password" 
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? "ẨN" : "HIỆN"}
              </button>
            </div>
          </div>
          <Link to="/forgot-password" className="forgot-link">Quên tên đăng nhập hoặc mật khẩu?</Link>
          <button type="submit" className="submit-btn">Đăng nhập</button>
          <Link to="/register" className="create-link">Chưa có tài khoản? Tạo tài khoản ngay.</Link>
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.95rem', color: '#555' }}>
            Hỗ trợ trực tuyến có thể được tìm thấy trong <Link to="/help" className="support-link">Trợ giúp tài khoản</Link>.
          </div>
        </form>
      </div>
      <div className="right-panel">
        <div className="school-health-info" style={{ marginTop: '60px', color: '#fff' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '18px' }}>Y tế học đường</div>
          <ul style={{ fontSize: '1.08rem', lineHeight: '1.7', paddingLeft: '18px', marginBottom: '32px' }}>
            <li>Chăm sóc sức khỏe học sinh toàn diện tại trường.</li>
            <li>Quản lý tiêm chủng, khám sức khỏe định kỳ, hồ sơ sức khỏe điện tử.</li>
            <li>Hỗ trợ khai báo y tế, phòng chống dịch bệnh.</li>
            <li>Tư vấn sức khỏe, dinh dưỡng và tâm lý học đường.</li>
          </ul>
          <div style={{ fontSize: '1rem', opacity: '0.85' }}>Nền tảng hiện đại giúp kết nối giữa nhà trường, phụ huynh và cơ sở y tế.</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
