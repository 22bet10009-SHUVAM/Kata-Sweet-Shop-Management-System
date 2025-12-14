import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sweetService } from '../services';
import { AuthRequest } from '../middleware';

/**
 * Sweet Controller
 * Handles HTTP requests for sweets management
 */
class SweetController {
  /**
   * Create a new sweet
   * POST /api/sweets
   */
  async createSweet(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          errors: errors.array()
        });
        return;
      }

      const { name, category, price, quantity, description, imageUrl } =
        req.body;

      const sweet = await sweetService.createSweet({
        name,
        category,
        price,
        quantity,
        description,
        imageUrl
      });

      res.status(201).json({
        success: true,
        message: 'Sweet created successfully',
        data: sweet
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all sweets
   * GET /api/sweets
   */
  async getAllSweets(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sweets = await sweetService.getAllSweets();

      res.status(200).json({
        success: true,
        count: sweets.length,
        data: sweets
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get sweet by ID
   * GET /api/sweets/:id
   */
  async getSweetById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sweet = await sweetService.getSweetById(req.params.id);

      res.status(200).json({
        success: true,
        data: sweet
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search sweets
   * GET /api/sweets/search
   */
  async searchSweets(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, category, minPrice, maxPrice } = req.query;

      const sweets = await sweetService.searchSweets({
        name: name as string,
        category: category as any,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined
      });

      res.status(200).json({
        success: true,
        count: sweets.length,
        data: sweets
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a sweet
   * PUT /api/sweets/:id
   */
  async updateSweet(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          errors: errors.array()
        });
        return;
      }

      const sweet = await sweetService.updateSweet(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Sweet updated successfully',
        data: sweet
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a sweet (Admin only)
   * DELETE /api/sweets/:id
   */
  async deleteSweet(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await sweetService.deleteSweet(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Sweet deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Purchase a sweet (decrease quantity)
   * POST /api/sweets/:id/purchase
   */
  async purchaseSweet(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { quantity = 1 } = req.body;
      const sweet = await sweetService.purchaseSweet(
        req.params.id,
        parseInt(quantity, 10)
      );

      res.status(200).json({
        success: true,
        message: 'Purchase successful',
        data: sweet
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Restock a sweet (Admin only)
   * POST /api/sweets/:id/restock
   */
  async restockSweet(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          errors: errors.array()
        });
        return;
      }

      const { quantity } = req.body;
      const sweet = await sweetService.restockSweet(
        req.params.id,
        parseInt(quantity, 10)
      );

      res.status(200).json({
        success: true,
        message: 'Restock successful',
        data: sweet
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SweetController();
