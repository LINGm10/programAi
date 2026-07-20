require('dotenv').config();
const { User } = require('../models');

async function createAdmin() {
  try {
    const existing = await User.findOne({ where: { email: 'admin@example.com' } });
    if (existing) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password_hash: 'admin123456',
      role: 'admin',
    });

    console.log('Admin user created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: admin123456');
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
