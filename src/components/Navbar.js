import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <nav className="header">
      <Link to="/" className="logo">
        <div className="logo-img">
          <img src="/assets/healthconnect-logo.svg" alt="HealthConnect Logo" height="30" />
        </div>
        <div className="logo-text">HEALTH CONNECT</div>
      </Link>
      
      <div className="main-nav">
        <Link to="/">Trang chủ</Link>
        <Link to="/dashboard">Tổng quan</Link>
        <Link to="/health-declaration">Khai báo y tế</Link>
        <Link to="/health-check-management">Khám sức khỏe</Link>
        <Link to="/vaccination-management">Tiêm chủng</Link>
        <Link to="/send-medicine">Gửi thuốc</Link>
        <Link to="/record-process">Hồ sơ y tế</Link>
        <Link to="/documents-blog">Tài liệu</Link>
      </div>
      
      <div className="header-actions">
        <button className="request-btn">Yêu cầu tư vấn</button>
        
        {isAuthenticated ? (
          <div className="user-account">
            <button className="user-button" onClick={toggleUserMenu}>
              <div className="user-avatar">
                <img src={user.avatar || "/assets/default-avatar.png"} alt="Avatar" />
              </div>
              <span className="user-name">{user.name}</span>
              <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <Link to="/profile" className="dropdown-item">
                  <i className="fas fa-user"></i> Thông tin cá nhân
                </Link>
                <Link to="/settings" className="dropdown-item">
                  <i className="fas fa-cog"></i> Cài đặt tài khoản
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout-item">
                  <i className="fas fa-sign-out-alt"></i> Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-link">
            <i className="fas fa-user-circle"></i> Đăng nhập
          </Link>
        )}
        
        <button className="search-btn">
          <i className="fas fa-search"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
