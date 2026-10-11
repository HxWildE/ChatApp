import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log('Database Connected to chat-app'));
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'chat-app'
    });
  } catch (error) {
    console.log('Database connection error:', error);
  }
};

export default connectDB;