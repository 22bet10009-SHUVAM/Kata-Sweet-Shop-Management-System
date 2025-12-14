import { useState, useEffect } from 'react';
import { FiX, FiUploadCloud, FiImage, FiTrash2 } from 'react-icons/fi';
import { uploadImage } from '../services';
import type { Sweet, SweetFormData, SweetCategory } from '../types';

interface SweetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SweetFormData) => Promise<void>;
  sweet?: Sweet | null;
  mode: 'create' | 'edit';
}

const categories: SweetCategory[] = [
  'chocolate',
  'candy',
  'cake',
  'cookie',
  'pastry',
  'ice cream',
  'traditional',
  'other',
];

export default function SweetFormModal({
  isOpen,
  onClose,
  onSubmit,
  sweet,
  mode,
}: SweetFormModalProps) {
  const [formData, setFormData] = useState<SweetFormData>({
    name: '',
    category: 'chocolate',
    price: 0,
    quantity: 0,
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sweet && mode === 'edit') {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
        description: sweet.description || '',
        imageUrl: sweet.imageUrl || '',
      });
    } else {
      setFormData({
        name: '',
        category: 'chocolate',
        price: 0,
        quantity: 0,
        description: '',
        imageUrl: '',
      });
    }
    setErrors({});
    setUploadError(null);
  }, [sweet, mode, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      const payload: SweetFormData = { ...formData };

      if (!payload.imageUrl?.trim()) {
        delete (payload as any).imageUrl;
      }

      if (!payload.description?.trim()) {
        delete (payload as any).description;
      }

      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setUploadError(null);
    setUploading(true);
    try {
      const result = await uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: result.url }));
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Upload failed';
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Close Button */}
        <button onClick={onClose} className="modal-close">
          <FiX />
        </button>

        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'create' ? 'Add New Sweet' : 'Edit Sweet'}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Name */}
            <div className="form-group">
              <label className="label">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Enter sweet name"
                style={errors.name ? { borderColor: '#ef4444' } : {}}
              />
              {errors.name && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="label">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as SweetCategory })}
                className="input-field"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price & Quantity Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="label">Price (₹) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                  min="0"
                  step="0.01"
                  style={errors.price ? { borderColor: '#ef4444' } : {}}
                />
                {errors.price && (
                  <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.price}</p>
                )}
              </div>

              <div className="form-group">
                <label className="label">Quantity *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  className="input-field"
                  min="0"
                  style={errors.quantity ? { borderColor: '#ef4444' } : {}}
                />
                {errors.quantity && (
                  <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.quantity}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Describe this delicious sweet..."
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label className="label">Product Image</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <label
                  htmlFor="sweet-image-upload"
                  className="btn btn-secondary"
                  style={{ cursor: 'pointer', padding: '0.75rem 1.25rem' }}
                >
                  <FiUploadCloud />
                  <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                </label>
                <input
                  id="sweet-image-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <div style={{ minWidth: '200px', color: 'var(--color-gray-400)', fontSize: '0.9rem' }}>
                  Upload a clear photo to make the card feel real. Max 5MB.
                </div>
              </div>

              {uploadError && (
                <p style={{ color: '#ef4444', marginTop: '0.5rem' }}>{uploadError}</p>
              )}

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="input-field"
                  placeholder="Or paste an image URL"
                  style={{ flex: '1 1 240px' }}
                />
                {formData.imageUrl && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                    style={{ padding: '0.65rem 1rem' }}
                  >
                    <FiTrash2 />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              {formData.imageUrl && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    borderRadius: '1rem',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '0.9rem',
                      overflow: 'hidden',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gray-300)' }}>
                    <FiImage />
                    <span style={{ wordBreak: 'break-all', maxWidth: '320px' }}>{formData.imageUrl}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : mode === 'create' ? 'Add Sweet' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
