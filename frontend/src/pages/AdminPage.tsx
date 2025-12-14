import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAllSweets,
  createSweet,
  updateSweet,
  deleteSweet,
  restockSweet,
} from '../services/sweetService';
import type { Sweet, SweetFormData } from '../types';
import {
  SweetFormModal,
  RestockModal,
  DeleteConfirmModal,
  Loading,
} from '../components';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi';
import { GiCupcake } from 'react-icons/gi';

export default function AdminPage() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchSweets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllSweets();
      setSweets(data);
    } catch (err) {
      toast.error('Failed to load sweets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error('Admin access required');
      navigate('/shop');
      return;
    }
    if (isAdmin) {
      fetchSweets();
    }
  }, [isAdmin, authLoading, navigate, fetchSweets]);

  // Stats
  const totalSweets = sweets.length;
  const totalStock = sweets.reduce((sum, s) => sum + s.quantity, 0);
  const lowStockCount = sweets.filter((s) => s.quantity < 10 && s.quantity > 0).length;
  const outOfStockCount = sweets.filter((s) => s.quantity === 0).length;

  const handleCreateSubmit = async (data: SweetFormData) => {
    try {
      const newSweet = await createSweet(data);
      setSweets((prev) => [newSweet, ...prev]);
      toast.success('Sweet created successfully!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create sweet';
      toast.error(message);
      throw err;
    }
  };

  const handleEditClick = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (data: SweetFormData) => {
    if (!selectedSweet) return;
    try {
      const updated = await updateSweet(selectedSweet._id, data);
      setSweets((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
      toast.success('Sweet updated successfully!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Update failed';
      toast.error(message);
      throw err;
    }
  };

  const handleRestockClick = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setShowRestockModal(true);
  };

  const handleRestockSubmit = async (quantity: number) => {
    if (!selectedSweet) return;
    try {
      const updated = await restockSweet(selectedSweet._id, quantity);
      setSweets((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
      toast.success(`Restocked ${quantity} units!`);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Restock failed';
      toast.error(message);
      throw err;
    }
  };

  const handleDeleteClick = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSweet) return;
    setDeleteLoading(true);
    try {
      await deleteSweet(selectedSweet._id);
      setSweets((prev) => prev.filter((s) => s._id !== selectedSweet._id));
      toast.success('Sweet deleted successfully!');
      setShowDeleteModal(false);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Delete failed';
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (authLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <div
        className="admin-header glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          border: '1px solid rgba(201, 162, 39, 0.15)',
          boxShadow: 'var(--shadow-gold)',
        }}
      >
        <div>
          <span style={{ 
            fontSize: '0.75rem', 
            color: 'var(--royal-gold)', 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase',
            opacity: 0.8
          }}>
            Control Center
          </span>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
            <GiCupcake style={{ color: 'var(--royal-gold)', filter: 'drop-shadow(0 0 12px rgba(201, 162, 39, 0.5))' }} />
            <span className="text-gradient">Admin Dashboard</span>
          </h1>
          <p style={{ color: 'var(--color-gray-400)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            Manage your premium confectionery inventory with precision
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
          style={{ boxShadow: 'var(--shadow-gold)' }}
        >
          <FiPlus />
          Add New Sweet
        </button>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div
          className="stat-card"
          style={{
            background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.12), rgba(67, 35, 113, 0.08))',
            border: '1px solid rgba(201, 162, 39, 0.15)',
            boxShadow: 'var(--shadow-gold)',
          }}
        >
          <p className="label">Total Sweets</p>
          <p className="value" style={{ color: 'var(--royal-gold)' }}>{totalSweets}</p>
        </div>
        <div
          className="stat-card"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(56, 189, 248, 0.08))',
            border: '1px solid rgba(6, 182, 212, 0.15)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <p className="label">Total Stock</p>
          <p className="value" style={{ color: '#7dd3fc' }}>{totalStock}</p>
        </div>
        <div
          className="stat-card"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(250, 204, 21, 0.08))',
            border: '1px solid rgba(245, 158, 11, 0.15)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <p className="label">Low Stock</p>
          <p className="value" style={{ color: 'var(--color-warning)' }}>{lowStockCount}</p>
        </div>
        <div
          className="stat-card"
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(248, 113, 113, 0.08))',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <p className="label">Out of Stock</p>
          <p className="value" style={{ color: 'var(--color-error)' }}>{outOfStockCount}</p>
        </div>
      </div>

      {/* Table */}
      <div
        className="glass-card"
        style={{
          borderRadius: '1.5rem',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'var(--shadow-glow)'
        }}
      >
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Sweet</th>
              <th style={{ textAlign: 'left' }}>Category</th>
              <th style={{ textAlign: 'right' }}>Price</th>
              <th style={{ textAlign: 'right' }}>Stock</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sweets.map((sweet) => (
              <tr key={sweet._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '0.9rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        color: 'white',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {sweet.category.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: 'white' }}>{sweet.name}</p>
                      {sweet.description && (
                        <p style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.25rem' }}>
                          {sweet.description.substring(0, 50)}...
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge badge-${sweet.category.replace(' ', '-')}`}>
                    {sweet.category}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--royal-gold)' }}>
                  ₹{sweet.price.toFixed(2)}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className={`stock-badge ${
                    sweet.quantity === 0 ? 'out-of-stock' :
                    sweet.quantity < 10 ? 'low-stock' : 'in-stock'
                  }`}>
                    {sweet.quantity}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEditClick(sweet)}
                      className="btn-icon"
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleRestockClick(sweet)}
                      className="btn-icon"
                      style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)' }}
                      title="Restock"
                    >
                      <FiPackage />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(sweet)}
                      className="btn-icon"
                      style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sweets.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <GiCupcake style={{ fontSize: '4rem', color: 'var(--color-gray-600)', filter: 'drop-shadow(0 0 24px rgba(139, 92, 246, 0.35))' }} />
            <p style={{ marginTop: '1rem', color: 'var(--color-gray-400)' }}>No sweets yet. Add your first sweet!</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <SweetFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
        mode="create"
      />

      <SweetFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditSubmit}
        sweet={selectedSweet}
        mode="edit"
      />

      <RestockModal
        isOpen={showRestockModal}
        onClose={() => setShowRestockModal(false)}
        onSubmit={handleRestockSubmit}
        sweet={selectedSweet}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        sweet={selectedSweet}
        loading={deleteLoading}
      />
    </div>
  );
}
