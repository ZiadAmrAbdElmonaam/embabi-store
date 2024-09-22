import mongoose from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: mongoose.Schema.Types.ObjectId;
    image?: string;
    colors?: string[]; // Array of strings representing available colors
    sale?: {
        discountPercentage: number;
        saleEndDate?: Date; // Optional sale end date
    };
    thumbnails?: string[]; // Array of strings representing image URLs or paths
}