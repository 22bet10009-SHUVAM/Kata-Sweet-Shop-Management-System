import Sweet, { ISweet, SweetCategory } from '../models/Sweet';
import { ApiError } from '../middleware/errorHandler';

/**
 * Sweet creation/update data interface
 */
interface SweetData {
  name: string;
  category: SweetCategory;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
}

/**
 * Search query interface
 */
interface SearchQuery {
  name?: string;
  category?: SweetCategory;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Sweet Service
 * Handles all sweet-related business logic
 */
class SweetService {
  /**
   * Create a new sweet
   * @param data - Sweet data
   * @returns Created sweet document
   */
  async createSweet(data: SweetData): Promise<ISweet> {
    const sweet = await Sweet.create(data);
    return sweet;
  }

  /**
   * Get all sweets
   * @returns Array of all sweets
   */
  async getAllSweets(): Promise<ISweet[]> {
    return Sweet.find().sort({ createdAt: -1 });
  }

  /**
   * Get sweet by ID
   * @param id - Sweet ID
   * @returns Sweet document
   */
  async getSweetById(id: string): Promise<ISweet> {
    const sweet = await Sweet.findById(id);

    if (!sweet) {
      throw new ApiError(404, 'Sweet not found');
    }

    return sweet;
  }

  /**
   * Search sweets by name, category, or price range
   * @param query - Search parameters
   * @returns Array of matching sweets
   */
  async searchSweets(query: SearchQuery): Promise<ISweet[]> {
    const filter: any = {};

    // Filter by name (case-insensitive partial match)
    if (query.name) {
      filter.name = { $regex: query.name, $options: 'i' };
    }

    // Filter by category
    if (query.category) {
      filter.category = query.category;
    }

    // Filter by price range
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {};
      if (query.minPrice !== undefined) {
        filter.price.$gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        filter.price.$lte = query.maxPrice;
      }
    }

    return Sweet.find(filter).sort({ createdAt: -1 });
  }

  /**
   * Update a sweet
   * @param id - Sweet ID
   * @param data - Updated sweet data
   * @returns Updated sweet document
   */
  async updateSweet(id: string, data: Partial<SweetData>): Promise<ISweet> {
    const sweet = await Sweet.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!sweet) {
      throw new ApiError(404, 'Sweet not found');
    }

    return sweet;
  }

  /**
   * Delete a sweet
   * @param id - Sweet ID
   * @returns Deleted sweet document
   */
  async deleteSweet(id: string): Promise<ISweet> {
    const sweet = await Sweet.findByIdAndDelete(id);

    if (!sweet) {
      throw new ApiError(404, 'Sweet not found');
    }

    return sweet;
  }

  /**
   * Purchase a sweet (decrease quantity)
   * @param id - Sweet ID
   * @param quantity - Quantity to purchase (default: 1)
   * @returns Updated sweet document
   */
  async purchaseSweet(id: string, quantity: number = 1): Promise<ISweet> {
    const sweet = await Sweet.findById(id);

    if (!sweet) {
      throw new ApiError(404, 'Sweet not found');
    }

    if (sweet.quantity < quantity) {
      throw new ApiError(400, 'Insufficient stock');
    }

    sweet.quantity -= quantity;
    await sweet.save();

    return sweet;
  }

  /**
   * Restock a sweet (increase quantity)
   * @param id - Sweet ID
   * @param quantity - Quantity to add
   * @returns Updated sweet document
   */
  async restockSweet(id: string, quantity: number): Promise<ISweet> {
    if (quantity <= 0) {
      throw new ApiError(400, 'Quantity must be a positive number');
    }

    const sweet = await Sweet.findById(id);

    if (!sweet) {
      throw new ApiError(404, 'Sweet not found');
    }

    sweet.quantity += quantity;
    await sweet.save();

    return sweet;
  }
}

export default new SweetService();
