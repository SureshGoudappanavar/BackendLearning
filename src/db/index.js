import mongoose from 'mongoose';

const connnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MONGOOSE connection error', error);
    process.exit(1);
  }
};

export default connnectDB;
