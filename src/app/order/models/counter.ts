import mongoose from 'mongoose';

// Define the Counter schema
const counterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

// Create and export the Counter model
const Counter = mongoose.model('Counter', counterSchema);

export default Counter;
