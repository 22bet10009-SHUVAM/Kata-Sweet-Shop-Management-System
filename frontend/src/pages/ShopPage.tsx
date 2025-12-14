import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllSweets, searchSweets, purchaseSweet, updateSweet, restockSweet, deleteSweet } from '../services/sweetService';
import type { Sweet, SearchQuery, SweetFormData } from '../types';
import {
  SweetCard,
  SearchBar,
  SweetFormModal,
  RestockModal,
  PurchaseModal,
  DeleteConfirmModal,
  Loading,
} from '../components';
import toast from 'react-hot-toast';
import { GiCupcake } from 'react-icons/gi';

export default function ShopPage() {
  const { isAdmin } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
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
    fetchSweets();
  }, [fetchSweets]);

  const handleSearch = async (query: SearchQuery) => {
    try {
      setLoading(true);
      const hasFilters = query.name || query.category || query.minPrice !== undefined || query.maxPrice !== undefined;
      const data = hasFilters ? await searchSweets(query) : await getAllSweets();
      setSweets(data);
    } catch (err) {
      toast.error('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    fetchSweets();
  };

  const handlePurchaseClick = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setShowPurchaseModal(true);
  };

  const handlePurchaseSubmit = async (quantity: number) => {
    if (!selectedSweet) return;
    try {
      const updated = await purchaseSweet(selectedSweet._id, quantity);
      setSweets((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );
      toast.success(`Successfully purchased ${quantity}x ${selectedSweet.name}!`);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Purchase failed';
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
      setSweets((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );
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
      setSweets((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );
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

  return (
    <div className="shop-page">
      {/* Header */}
      <div className="page-header">
        <span className="page-header-subtitle">Explore Our</span>
        <h1>Sweet Collection</h1>
        <p>Discover our exquisite range of handcrafted premium confections, made fresh daily with the finest ingredients.</p>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />

      {/* Content */}
      {loading ? (
        <Loading />
      ) : sweets.length === 0 ? (
        <div className="empty-state">
          <GiCupcake />
          <h2>No sweets found</h2>
          <p>Try adjusting your search filters or browse our categories</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', marginTop: '0.5rem' }}>
            Tip: Clear all filters to see our full collection
          </p>
        </div>
      ) : (
        <>
          <div className="results-info">
            <p className="sweets-count">{sweets.length} sweet(s) found</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>
              Click on any item to view details and make a purchase
            </p>
          </div>
          <div className="sweets-grid">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onPurchase={handlePurchaseClick}
                onEdit={handleEditClick}
                onRestock={handleRestockClick}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onSubmit={handlePurchaseSubmit}
        sweet={selectedSweet}
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
