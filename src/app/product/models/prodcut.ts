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
  colors: {
    type: [String], // Array of strings for colors
    required: false,
  },
  sale: {
    discountPercentage: {
      type: Number, // Sale discount percentage
      required: false,
    },
    saleEndDate: {
      type: Date, // Optional sale end date
      required: false,
    },
  },
  thumbnails: {
    type: [String], // Array of strings for thumbnails (image URLs or paths)
    required: false,
  }
});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;