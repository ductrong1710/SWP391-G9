import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-icon">
            <i className="fas fa-sign-out-alt"></i>
          </div>
          <h3>{title}</h3>
          <button className="modal-close" onClick={onCancel}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="modal-button modal-button-secondary" onClick={onCancel}>
            <i className="fas fa-times mr-2"></i>
            Hủy
          </button>
          <button className="modal-button modal-button-primary" onClick={onConfirm}>
            <i className="fas fa-check mr-2"></i>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
