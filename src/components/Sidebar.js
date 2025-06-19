import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <div className="logo-img">
            <img src="/assets/healthconnect-logo.svg" alt="HealthConnect Logo" />
          </div>
          {!collapsed && <div className="logo-text">HEALTH CONNECT</div>}
        </Link>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <i className={`fas fa-chevron-${collapsed ? 'right' : 'left'}`}></i>
        </button>
      </div>
      
      <div className="sidebar-menu">
        <Link to="/" className={`menu-item ${isActive('/')}`}>
          <div className="menu-icon">
            <i className="fas fa-home"></i>
          </div>
          {!collapsed && <span className="menu-text">Trang chủ</span>}
        </Link>
        
        <Link to="/dashboard" className={`menu-item ${isActive('/dashboard')}`}>
          <div className="menu-icon">
            <i className="fas fa-chart-pie"></i>
          </div>
          {!collapsed && <span className="menu-text">Tổng quan</span>}
        </Link>
        
        <Link to="/health-declaration" className={`menu-item ${isActive('/health-declaration')}`}>
          <div className="menu-icon">
            <i className="fas fa-clipboard-list"></i>
          </div>
          {!collapsed && <span className="menu-text">Khai báo y tế</span>}
        </Link>
        
        <Link to="/health-check-management" className={`menu-item ${isActive('/health-check-management')}`}>
          <div className="menu-icon">
            <i className="fas fa-stethoscope"></i>
          </div>
          {!collapsed && <span className="menu-text">Khám sức khỏe</span>}
        </Link>
        
        <Link to="/vaccination-management" className={`menu-item ${isActive('/vaccination-management')}`}>
          <div className="menu-icon">
            <i className="fas fa-syringe"></i>
          </div>
          {!collapsed && <span className="menu-text">Tiêm chủng</span>}
        </Link>
        
        <Link to="/send-medicine" className={`menu-item ${isActive('/send-medicine')}`}>
          <div className="menu-icon">
            <i className="fas fa-pills"></i>
          </div>
          {!collapsed && <span className="menu-text">Gửi thuốc</span>}
        </Link>
        
        <Link to="/record-process" className={`menu-item ${isActive('/record-process')}`}>
          <div className="menu-icon">
            <i className="fas fa-file-medical"></i>
          </div>
          {!collapsed && <span className="menu-text">Hồ sơ y tế</span>}
        </Link>
        
        <Link to="/documents-blog" className={`menu-item ${isActive('/documents-blog')}`}>
          <div className="menu-icon">
            <i className="fas fa-book-medical"></i>
          </div>
          {!collapsed && <span className="menu-text">Tài liệu</span>}
        </Link>
      </div>
      
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="footer-text">
            © 2025 HealthConnect
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
