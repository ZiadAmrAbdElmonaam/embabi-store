import mongoose from "mongoose";

export interface IOrderItem {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }