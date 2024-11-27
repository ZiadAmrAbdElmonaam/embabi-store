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
      colorName: { type: String, required: true },
      quantity: { type: Number, required: true, min: 0 },
      _id: false // This prevents MongoDB from adding _id to each color subdocument
    }
  ],
  sale: {
    discountPercentage: {
      type: Number,
      required: false,
    },
    saleEndDate: {
      type: Date,
      required: false,
    },
  },
  thumbnails: {
    type: [String],
    required: false,
  },
  
});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
