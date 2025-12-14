import { useState } from 'react';
import { FiX, FiPackage } from 'react-icons/fi';
import type { Sweet } from '../types';

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quantity: number) => Promise<void>;
  sweet: Sweet | null;
}

export default function RestockModal({
  isOpen,
  onClose,
  onSubmit,
  sweet,
}: RestockModalProps) {
  const [quantity, setQuantity] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    setLoading(true);
    try {
      await onSubmit(quantity);
      setQuantity(10);
      onClose();
    } catch (err) {
      console.error('Error restocking:', err);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="modal-icon green">
            <FiPackage />
          </div>
          <h2 className="modal-title">Restock Sweet</h2>
          <p className="modal-subtitle">
            Add more <strong>{sweet.name}</strong> to inventory
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="info-box">
              <div className="info-row">
                <span className="label">Current Stock:</span>
                <span className="value">{sweet.quantity} units</span>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Quantity to Add</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="input-field"
                min="1"
                placeholder="Enter quantity"
                style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}
              />
            </div>

            <div className="total-box">
              <div className="info-row">
                <span className="label">New Stock Total:</span>
                <span className="value">{sweet.quantity + quantity} units</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading || quantity <= 0} className="btn btn-success">
              {loading ? 'Restocking...' : 'Confirm Restock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
