import mongoose, { Document, Schema } from 'mongoose';

/**
 * Sweet category enumeration
 */
export enum SweetCategory {
  CHOCOLATE = 'chocolate',
  CANDY = 'candy',
  CAKE = 'cake',
  COOKIE = 'cookie',
  PASTRY = 'pastry',
  ICE_CREAM = 'ice cream',
  TRADITIONAL = 'traditional',
  OTHER = 'other'
}

/**
 * Sweet interface extending Mongoose Document
 */
export interface ISweet extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: SweetCategory;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Sweet Schema Definition
 */
const sweetSchema = new Schema<ISweet>(
  {
    name: {
      type: String,
      required: [true, 'Sweet name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: Object.values(SweetCategory),
        message: 'Invalid category'
      }
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    imageUrl: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Create index for search functionality
sweetSchema.index({ name: 'text', category: 'text' });

// Create and export Sweet model
const Sweet = mongoose.model<ISweet>('Sweet', sweetSchema);

export default Sweet;
