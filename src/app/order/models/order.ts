import mongoose, { Document } from 'mongoose';
import { IOrderItem, IOrder } from '../interfaces/IOrderItem';
import Counter from './counter';

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
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    colors: {
      type: String,
      required: true,
    },
  }],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'ordered', 'prepared', 'shipped', 'cancelled', 'delivered'],
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
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: 'orderId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.orderId = counter!.seq;
  }
  next();
});

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
