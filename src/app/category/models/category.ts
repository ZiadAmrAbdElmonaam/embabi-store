import mongoose from "mongoose";
import { ICategory } from "../interfaces/ICategory";

const categorySchema = new mongoose.Schema<ICategory>({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  });
  
  const Category = mongoose.model<ICategory>('Category', categorySchema);
  export default Category;