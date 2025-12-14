import type { Sweet } from '../types';
import { FiShoppingCart, FiEdit2, FiPackage, FiInfo } from 'react-icons/fi';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase?: (sweet: Sweet) => void;
  onEdit?: (sweet: Sweet) => void;
  onRestock?: (sweet: Sweet) => void;
  isAdmin?: boolean;
}

export default function SweetCard({ sweet, onPurchase, onEdit, onRestock, isAdmin }: SweetCardProps) {
  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity < 10;

  const getStockBadgeClass = () => {
    if (isOutOfStock) return 'stock-badge out-of-stock';
    if (isLowStock) return 'stock-badge low-stock';
    return 'stock-badge in-stock';
  };

  const getCategoryBadgeClass = () => {
    const category = sweet.category.replace(' ', '-');
    return `badge badge-${category}`;
  };

  const getStockStatusText = () => {
    if (isOutOfStock) return 'Currently unavailable';
    if (isLowStock) return `Only ${sweet.quantity} remaining - Order soon!`;
    return `${sweet.quantity} in stock`;
  };

  return (
    <div className="sweet-card">
      {/* Image Section */}
      <div className="sweet-card-image">
        {sweet.imageUrl ? (
          <img
            src={sweet.imageUrl}
            alt={sweet.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span className="emoji" style={{ fontWeight: 700 }}>
            {sweet.category.slice(0, 2).toUpperCase()}
          </span>
        )}

        {/* Badges */}
        <div className="sweet-card-badges">
          <span className={getCategoryBadgeClass()}>{sweet.category}</span>
          <span className={getStockBadgeClass()}>
            {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} left`}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="sweet-card-content">
        <h3 className="sweet-card-name">{sweet.name}</h3>
        
        {sweet.description ? (
          <p className="sweet-card-description">{sweet.description}</p>
        ) : (
          <p className="sweet-card-description" style={{ fontStyle: 'italic', opacity: 0.7 }}>
            Delicious handcrafted {sweet.category.toLowerCase()} made with premium ingredients.
          </p>
        )}

        <div className="sweet-card-meta">
          <span className="sweet-card-stock-status">
            <FiInfo size={12} />
            {getStockStatusText()}
          </span>
        </div>

        <div className="sweet-card-price">₹{sweet.price.toFixed(2)}</div>

        {/* Action Buttons */}
        <div className="sweet-card-actions">
          <button
            onClick={() => onPurchase?.(sweet)}
            disabled={isOutOfStock}
            className={isOutOfStock ? 'btn btn-secondary' : 'btn btn-primary'}
            style={{ flex: 1 }}
          >
            <FiShoppingCart />
            <span>{isOutOfStock ? 'Sold Out' : 'Purchase'}</span>
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => onEdit?.(sweet)}
                className="btn-icon"
                title="Edit Sweet"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => onRestock?.(sweet)}
                className="btn-icon"
                style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)' }}
                title="Restock"
              >
                <FiPackage />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
