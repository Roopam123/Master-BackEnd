import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// accept data form
app.use(express.json({ limit: "100kb" }));

// when resive data from url
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// route import
import userRouter from "./routes/user.router.js";

// routes
app.use("/api/v1/users", userRouter);

export { app };
