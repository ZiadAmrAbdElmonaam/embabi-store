import mongoose, { Document } from 'mongoose';
import { IOrderItem } from '../interfaces/IOrderItem';
import Counter from './counter';


// Define the Order interface
export interface IOrder extends Document {
  orderId: number; // This will auto-increment
  user: mongoose.Schema.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: 'pending' | 'ordered' | 'prepared'|'shipped'|'cancelled'|'delevired';
  address: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema<IOrder>({
  orderId: {
    type: Number,
    unique: true,
  },
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
      colors: [
        {
          colorName: { type: String, required: true },
          quantity: { type: Number, required: true },
          _id: false,
        },
      ],
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
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Pre-save hook to auto-increment orderId
orderSchema.pre('save', async function (next) {
  const order = this as IOrder;

  // Only increment if it's a new order
  if (order.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: 'orderId' },  // Find the counter by 'orderId'
      { $inc: { seq: 1 } },  // Increment the sequence by 1
      { new: true, upsert: true }  // Create the counter document if it doesn't exist
    );
    order.orderId = counter!.seq;  // Assign the incremented sequence to orderId
  }
  next();
});

// Create and export the Order model
const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
