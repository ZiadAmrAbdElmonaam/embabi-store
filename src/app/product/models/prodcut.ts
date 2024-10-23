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
  quantity: {
    type: Number,
    required: false,
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
      colorName: { type: String, required: true },  // Name of the color
      quantity: { type: Number, required: true, min: 0 },  // Quantity for that color
    }
  ], 
  sale: {
    discountPercentage: {
      type: Number,  // Sale discount percentage
      required: false,
    },
    saleEndDate: {
      type: Date,  // Optional sale end date
      required: false,
    },
  },
  thumbnails: {
    type: [String],  // Array of strings for thumbnails (image URLs or paths)
    required: false,
  },
});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
