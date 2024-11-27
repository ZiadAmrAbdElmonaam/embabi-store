import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
}
export interface IOrder extends Document {
  orderId: number;  
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
