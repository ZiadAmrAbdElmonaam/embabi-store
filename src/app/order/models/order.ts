import mongoose, { Document, Schema } from 'mongoose';
import { IOrderItem } from '../interfaces/IOrderItem';

// Define the Order interface
export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Create Order Schema
const orderSchema = new mongoose.Schema<IOrder>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
}, {
  timestamps: true, // Automatically creates `createdAt` and `updatedAt`
});

// Create and export the Order model
const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;