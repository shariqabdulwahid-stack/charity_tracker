const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');

// Load environment variables from .env
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB using your .env connection string
    await mongoose.connect(process.env.MONGODB_URI);

    const hash = await bcrypt.hash('secure123', 10);

    const user = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: hash
    });

    await user.save();
    console.log('✅ Admin user created:', user);

  } catch (err) {
    console.error('❌ Error creating admin user:', err);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();