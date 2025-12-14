import api from './api';
import type { Sweet, SweetsResponse, SweetResponse, SweetFormData, SearchQuery } from '../types';

/**
 * Get all sweets
 */
export const getAllSweets = async (): Promise<Sweet[]> => {
  const response = await api.get<SweetsResponse>('/sweets');
  return response.data.data;
};

/**
 * Get sweet by ID
 */
export const getSweetById = async (id: string): Promise<Sweet> => {
  const response = await api.get<SweetResponse>(`/sweets/${id}`);
  return response.data.data;
};

/**
 * Search sweets
 */
export const searchSweets = async (query: SearchQuery): Promise<Sweet[]> => {
  const params = new URLSearchParams();
  if (query.name) params.append('name', query.name);
  if (query.category) params.append('category', query.category);
  if (query.minPrice !== undefined) params.append('minPrice', query.minPrice.toString());
  if (query.maxPrice !== undefined) params.append('maxPrice', query.maxPrice.toString());
  
  const response = await api.get<SweetsResponse>(`/sweets/search?${params.toString()}`);
  return response.data.data;
};

/**
 * Create a new sweet (Admin only)
 */
export const createSweet = async (data: SweetFormData): Promise<Sweet> => {
  const response = await api.post<SweetResponse>('/sweets', data);
  return response.data.data;
};

/**
 * Update a sweet (Admin only)
 */
export const updateSweet = async (id: string, data: Partial<SweetFormData>): Promise<Sweet> => {
  const response = await api.put<SweetResponse>(`/sweets/${id}`, data);
  return response.data.data;
};

/**
 * Delete a sweet (Admin only)
 */
export const deleteSweet = async (id: string): Promise<void> => {
  await api.delete(`/sweets/${id}`);
};

/**
 * Purchase a sweet
 */
export const purchaseSweet = async (id: string, quantity: number = 1): Promise<Sweet> => {
  const response = await api.post<SweetResponse>(`/sweets/${id}/purchase`, { quantity });
  return response.data.data;
};

/**
 * Restock a sweet (Admin only)
 */
export const restockSweet = async (id: string, quantity: number): Promise<Sweet> => {
  const response = await api.post<SweetResponse>(`/sweets/${id}/restock`, { quantity });
  return response.data.data;
};
