import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
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
        <Link to="/login" className="login-link">
          <i className="fas fa-user-circle"></i> Đăng nhập
        </Link>
        <button className="search-btn">
          <i className="fas fa-search"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
