import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import userRouter from './route/user.route.js';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use("/api/room",userRouter)

// Global error handling middleware
app.use((err:Error, req: Request, res: Response,next:NextFunction) => {
  res.status(500).json({
    success: false,
    message:err.message || "Something went wrong",
  });
});

const port = parseInt(process.env.PORT || "8001");
app.listen(port,"0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});