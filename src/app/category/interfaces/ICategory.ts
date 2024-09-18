import mongoose, { Document } from 'mongoose'; // Import ObjectId from mongoose

export interface ICategory extends Document {
  name: string;
  products: mongoose.Types.ObjectId[]; 
}
