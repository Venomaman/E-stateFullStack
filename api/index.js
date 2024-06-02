import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("server ruuning on port 3000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

//middleware..
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const msg = err.msg || "Internal server errorr";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    msg,
  });
});
