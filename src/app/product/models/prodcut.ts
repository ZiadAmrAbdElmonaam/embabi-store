import mongoose from "mongoose";
import { IProduct } from "../Interfaces/IProduct";

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  image: {
    type: String, 
    required: false,
  },
  colors: [
    {
      colorName: { type: String, required: true },
      quantity: { type: Number, required: true, min: 0 },
    }
  ] 
});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
