import { FiX, FiAlertTriangle } from 'react-icons/fi';
import type { Sweet } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  sweet: Sweet | null;
  loading: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  sweet,
  loading,
}: DeleteConfirmModalProps) {
  if (!isOpen || !sweet) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Close Button */}
        <button onClick={onClose} className="modal-close">
          <FiX />
        </button>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon red">
            <FiAlertTriangle />
          </div>
          <h2 className="modal-title">Delete Sweet?</h2>
          <p className="modal-subtitle">
            Are you sure you want to delete <strong>"{sweet.name}"</strong>?
            <br />
            <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>This action cannot be undone.</span>
          </p>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="info-box">
            <div className="info-row">
              <span className="label">Category:</span>
              <span className="value">{sweet.category}</span>
            </div>
            <div className="info-row">
              <span className="label">Price:</span>
              <span className="value">₹{sweet.price.toFixed(2)}</span>
            </div>
            <div className="info-row">
              <span className="label">In Stock:</span>
              <span className="value">{sweet.quantity} units</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete Sweet'}
          </button>
        </div>
      </div>
    </div>
  );
}
