import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import { userActivityLogger } from './middleware/userActivityLogger';
import { UserActivityLogService } from './services/UserActivityLogService';
import UserActivityLogModel from './models/UserActivityLog';
import ticketRoutes from './routes/ticketRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

// Create Express app
const app: Application = express();

const userActivityLogModel = new UserActivityLogModel();

const userActivityLogService = new UserActivityLogService(userActivityLogModel);

// Middleware
app.use(cors());
app.use(express.json());

app.use(userActivityLogger(userActivityLogService))

//Routes
app.use('/api/tickets', ticketRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Connect to MongoDB
async function connectToDatabase() {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('MongoDB connection string not provided. Please set MONGODB_URI in .env file.');
    return;
  }

  try {
    await mongoose.connect(mongoURI, {});

    console.log('Connected to MongoDB successfully');

    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();