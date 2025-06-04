import mongoose from 'mongoose';
import User from '../scr/users/user.model.js';  // corregida la ruta

export const dbConnection = async () => {
  try {
    mongoose.connection
      .on('error', () => console.log('MongoDB | Could not connect'))
      .on('connecting', () => console.log('MongoDB | Connecting...'))
      .on('connected', () => console.log('MongoDB | Connected'))
      .on('open', async () => {
        console.log('MongoDB | Connection opened');
        await createDefaultAdmin();
      })
      .on('reconnected', () => console.log('MongoDB | Reconnected'))
      .on('disconnected', () => console.log('MongoDB | Disconnected'));

    await mongoose.connect(process.env.URI_MONGO, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 50,
    });

  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: 'ADMINB' });
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    const adminUser = new User({
      username: 'ADMINB',
      password: 'ADMINB',   // mínimo 8 caracteres
      role: 'ADMIN_ROLE',          // valor válido según enum en el esquema
      name: 'Admin',
      surname: 'User',
      email: 'admin@example.com',
      phone: '12345678',
      profile: '',
      estado: true,
      google: false
    });

    await adminUser.save();
    console.log('Default admin user created');
  } catch (err) {
    console.error('Error creating default admin:', err);
  }
};

