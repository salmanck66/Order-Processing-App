import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.JWT_SECRET)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
