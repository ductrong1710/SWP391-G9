import React from 'react';
import './Modal.css';

const ErrorDialog = ({ open, message, onClose, type = 'error' }) => {
  if (!open) return null;
  const isSuccess = type === 'success';
  return (
    <div className="error-dialog-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 style={{color: isSuccess ? '#059669' : '#d32f2f', display: 'flex', alignItems: 'center', gap: 8}}>
            <i className={`fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
            {isSuccess ? 'Thành công' : 'Lỗi'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <p style={{color: isSuccess ? '#059669' : '#d32f2f'}}>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="modal-button modal-button-primary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialog; 