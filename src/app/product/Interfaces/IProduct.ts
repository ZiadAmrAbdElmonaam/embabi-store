import mongoose from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: mongoose.Schema.Types.ObjectId;
    image?: string;
  }