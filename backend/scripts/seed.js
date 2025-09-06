const mongoose = require('mongoose');
const Item = require('../models/Item');
require('dotenv').config();

const sampleItems = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with A17 Pro chip and titanium design',
    price: 159900,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    inStock: true,
    stock: 50
  },
  {
    name: 'MacBook Pro M3',
    description: 'Powerful laptop with M3 chip for professionals',
    price: 169900,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    inStock: true,
    stock: 25
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Air Max technology',
    price: 10000,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    inStock: true,
    stock: 100
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'Classic straight-fit jeans',
    price: 999,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    inStock: true,
    stock: 75
  },
  {
    name: 'The Great Gatsby',
    description: 'Classic American novel by F. Scott Fitzgerald',
    price: 499,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    inStock: true,
    stock: 200
  },
  {
    name: 'Coffee Table',
    description: 'Modern wooden coffee table for living room',
    price: 2999,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400',
    inStock: true,
    stock: 15
  },
  {
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 2000,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    inStock: false,
    stock: 0
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat for home workouts',
    price: 200,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    inStock: true,
    stock: 80
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');

    // Insert sample items
    await Item.insertMany(sampleItems);
    console.log('Inserted sample items');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();