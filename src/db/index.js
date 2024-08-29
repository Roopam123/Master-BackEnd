import mongoose from "mongoose";
import { DB_NAME } from "../contents.js";

const connectDB = async () => {
  try {
    const connectInstanceDB = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `\n MONGOBD connected successfully!! DB HOST:${connectInstanceDB.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connect faild", error);
    process.exit(1);
  }
};

export default connectDB;
