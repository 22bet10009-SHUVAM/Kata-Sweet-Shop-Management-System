import { useState } from 'react';
import { FiX, FiShoppingCart, FiMinus, FiPlus, FiTruck, FiShield, FiClock } from 'react-icons/fi';
import type { Sweet } from '../types';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quantity: number) => Promise<void>;
  sweet: Sweet | null;
}

export default function PurchaseModal({
  isOpen,
  onClose,
  onSubmit,
  sweet,
}: PurchaseModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0 || !sweet || quantity > sweet.quantity) return;

    setLoading(true);
    try {
      await onSubmit(quantity);
      setQuantity(1);
      onClose();
    } catch (err) {
      console.error('Error purchasing:', err);
    } finally {
      setLoading(false);
    }
  };

  const incrementQty = () => {
    if (sweet && quantity < sweet.quantity) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  if (!isOpen || !sweet) return null;

  const total = (sweet.price * quantity).toFixed(2);
  const savings = quantity >= 5 ? (sweet.price * quantity * 0.05).toFixed(2) : null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Close Button */}
        <button onClick={onClose} className="modal-close">
          <FiX />
        </button>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon pink">
            <FiShoppingCart />
          </div>
          <h2 className="modal-title">Purchase Sweet</h2>
          <p className="modal-subtitle">
            You're about to purchase <strong>{sweet.name}</strong>
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="info-box">
              <div className="info-row">
                <span className="label">Category:</span>
                <span className="value" style={{ textTransform: 'capitalize' }}>{sweet.category}</span>
              </div>
              <div className="info-row">
                <span className="label">Price per item:</span>
                <span className="value" style={{ color: 'var(--royal-gold)' }}>₹{sweet.price.toFixed(2)}</span>
              </div>
              <div className="info-row">
                <span className="label">Available stock:</span>
                <span className="value">{sweet.quantity} units</span>
              </div>
              {sweet.description && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-400)', marginTop: '0.75rem', lineHeight: 1.5, fontStyle: 'italic' }}>
                  {sweet.description}
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="quantity-selector">
              <button
                type="button"
                onClick={decrementQty}
                disabled={quantity <= 1}
                className="quantity-btn"
              >
                <FiMinus />
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                type="button"
                onClick={incrementQty}
                disabled={quantity >= sweet.quantity}
                className="quantity-btn"
              >
                <FiPlus />
              </button>
            </div>

            {quantity >= 5 && (
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-success)', marginBottom: '1rem' }}>
                Bulk order - You save ₹{savings}!
              </p>
            )}

            <div className="total-box">
              <div className="info-row">
                <span className="label">Total Amount:</span>
                <span className="value">₹{total}</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(201, 162, 39, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                <FiTruck size={12} style={{ color: 'var(--royal-gold)' }} />
                <span>Fast Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                <FiShield size={12} style={{ color: 'var(--royal-gold)' }} />
                <span>Quality Assured</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>
                <FiClock size={12} style={{ color: 'var(--royal-gold)' }} />
                <span>Fresh Daily</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Processing...' : `Purchase for ₹${total}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
