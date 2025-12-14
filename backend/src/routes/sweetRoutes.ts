import { Router } from 'express';
import { body } from 'express-validator';
import { sweetController } from '../controllers';
import { authenticate, authorizeAdmin } from '../middleware';
import { SweetCategory } from '../models/Sweet';

const router = Router();

// All sweet routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/sweets/search
 * @desc    Search sweets by name, category, or price range
 * @access  Private
 */
router.get('/search', sweetController.searchSweets);

/**
 * @route   GET /api/sweets
 * @desc    Get all sweets
 * @access  Private
 */
router.get('/', sweetController.getAllSweets);

/**
 * @route   GET /api/sweets/:id
 * @desc    Get sweet by ID
 * @access  Private
 */
router.get('/:id', sweetController.getSweetById);

/**
 * @route   POST /api/sweets
 * @desc    Create a new sweet
 * @access  Private (Admin)
 */
router.post(
  '/',
  authorizeAdmin,
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('category')
      .isIn(Object.values(SweetCategory))
      .withMessage('Invalid category'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('quantity')
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    body('imageUrl')
      .optional()
      .trim()
      .custom((value) => {
        if (!value) return true;
        // Allow relative paths starting with / or full URLs
        if (value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://')) {
          return true;
        }
        throw new Error('Invalid image URL or path');
      })
  ],
  sweetController.createSweet
);

/**
 * @route   PUT /api/sweets/:id
 * @desc    Update a sweet
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  authorizeAdmin,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('category')
      .optional()
      .isIn(Object.values(SweetCategory))
      .withMessage('Invalid category'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    body('imageUrl')
      .optional()
      .trim()
      .custom((value) => {
        if (!value) return true;
        // Allow relative paths starting with / or full URLs
        if (value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://')) {
          return true;
        }
        throw new Error('Invalid image URL or path');
      })
  ],
  sweetController.updateSweet
);

/**
 * @route   DELETE /api/sweets/:id
 * @desc    Delete a sweet (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', authorizeAdmin, sweetController.deleteSweet);

/**
 * @route   POST /api/sweets/:id/purchase
 * @desc    Purchase a sweet (decrease quantity)
 * @access  Private
 */
router.post('/:id/purchase', sweetController.purchaseSweet);

/**
 * @route   POST /api/sweets/:id/restock
 * @desc    Restock a sweet (Admin only)
 * @access  Private (Admin)
 */
router.post(
  '/:id/restock',
  authorizeAdmin,
  [
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer')
  ],
  sweetController.restockSweet
);

export default router;
