import React from 'react';
import './Modal.css';

const ErrorDialog = ({ open, message, onClose, type = 'error', onConfirm }) => {
  if (!open) return null;
  const isSuccess = type === 'success';
  const isInfo = type === 'info';
  return (
    <div className="error-dialog-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 style={{color: isSuccess ? '#388e3c' : isInfo ? '#1976d2' : '#d32f2f'}}>
            {isSuccess ? 'Thành công' : isInfo ? 'Xác nhận' : 'Lỗi'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <p style={{color: isSuccess ? '#388e3c' : isInfo ? '#1976d2' : '#d32f2f'}}>{message}</p>
        </div>
        <div className="modal-footer">
          {onConfirm ? (
            <>
              <button className="modal-button modal-button-success" onClick={onConfirm}>Đồng ý</button>
              <button className="modal-button modal-button-primary" onClick={onClose}>Đóng</button>
            </>
          ) : (
            <button className={isSuccess ? "modal-button modal-button-success" : isInfo ? "modal-button modal-button-primary" : "modal-button modal-button-primary"} onClick={onClose}>
              Đóng
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDialog; 