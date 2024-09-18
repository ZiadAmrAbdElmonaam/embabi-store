import mongoose from 'mongoose';
import dotenv from 'dotenv';

import bcrypt from 'bcryptjs';
import Category from '../app/category/models/category';
import User from '../app/user/models/User';

dotenv.config(); // Load .env variables

// Connect to the database
mongoose.connect(process.env.MONGO_URI || '', {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Seed Categories
const seedCategories = async () => {
  const categories = [
    { name: 'Electronics' },
    { name: 'Home Appliances' },
    { name: 'Books' },
    { name: 'Clothing' },
    { name: 'Toys' }
  ];

  await Category.insertMany(categories);
  console.log('Categories seeded');
};

// Seed Users
const seedUsers = async () => {
  const adminPassword = await bcrypt.hash('adminpassword', 10); // Hash password for admin
  const userPassword = await bcrypt.hash('userpassword', 10); // Hash password for normal user

  const users = [
    {
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin', // Set role to admin
    },
    {
      username: 'user',
      email: 'user@example.com',
      password: userPassword,
      role: 'user', // Set role to normal user
    },
  ];

  await User.insertMany(users);
  console.log('Users seeded');
};

// Seed the database
const seedDatabase = async () => {
  try {
    await seedCategories();
    await seedUsers();
    console.log('Database seeded successfully');
    mongoose.connection.close(); // Close connection after seeding
  } catch (error) {
    console.error('Error seeding the database:', error);
    mongoose.connection.close(); 
  }
};

seedDatabase();
