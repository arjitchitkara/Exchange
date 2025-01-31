import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { usersRouter } from './routes/users';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/users', usersRouter);

app.listen(port, () => {
  console.log(`Backend service running on port ${port}`);
}); 