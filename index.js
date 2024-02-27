
import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js"
dotenv.config();


const port = process.env.PORT || 5000;

const server = app.listen(port, async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    console.log(`Database connected successfully`)
    console.log(`Server is running on port ${port}`)
  } catch (error) {
 console.log(error);
  }
});
