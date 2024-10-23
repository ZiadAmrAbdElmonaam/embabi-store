import mongoose from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: mongoose.Schema.Types.ObjectId;
    image?: string;
    colors: IColor[];
    quantity?: number;
    sale?: {
        discountPercentage: number;
        saleEndDate?: Date; 
    };
    thumbnails?: string[]; 
  }
  
export interface IColor {
  colorName: string;
  quantity: number;
}

  

