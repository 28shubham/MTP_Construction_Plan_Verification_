import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <div className="modal-body">{children}</div>
        <button className="modal-close" onClick={onClose}>
          ✖ Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
