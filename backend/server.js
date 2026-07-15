import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { setServers } from "node:dns/promises"; 

try {
  setServers(["1.1.1.1", "8.8.8.8"]);
} catch (err) {
  console.warn("DNS custom override bypassed:", err.message);
}

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', taskRoutes);

app.get('/', (req, res) => {
  res.send('MERN API is running...');
});

app.use((err, req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
