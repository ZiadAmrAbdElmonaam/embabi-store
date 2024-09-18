import mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";

const userSchema = new mongoose.Schema<IUser>({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  });
  
  const User = mongoose.model<IUser>('User', userSchema);
  
  export default User;