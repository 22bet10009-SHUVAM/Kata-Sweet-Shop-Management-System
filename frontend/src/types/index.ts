// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Sweet Types
export type SweetCategory =
  | 'chocolate'
  | 'candy'
  | 'cake'
  | 'cookie'
  | 'pastry'
  | 'ice cream'
  | 'traditional'
  | 'other';

export interface Sweet {
  _id: string;
  name: string;
  category: SweetCategory;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SweetsResponse {
  success: boolean;
  count: number;
  data: Sweet[];
}

export interface SweetResponse {
  success: boolean;
  message?: string;
  data: Sweet;
}

// Search Query
export interface SearchQuery {
  name?: string;
  category?: SweetCategory;
  minPrice?: number;
  maxPrice?: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SweetFormData {
  name: string;
  category: SweetCategory;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
}
