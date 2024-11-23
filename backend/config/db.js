import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DataBase Connection established!!");
  } catch (err) {
    console.error(err.message);
  }
};

export default connectDB;
