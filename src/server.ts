import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http'; // Import http module for server
import authRoutes from './routes/authRoutes';
import { userActivityLogger } from './middleware/userActivityLogger';
import { UserActivityLogService } from './services/UserActivityLogService';
import UserActivityLogModel from './models/UserActivityLog';
import ticketRoutes from './routes/ticketRoutes';
import commentRoutes from './routes/commentRoutes';
import roleRoutes from './routes/roleRoutes';
import { seedRoles } from './seeds/roleSeeder';

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
app.use('/api/role', roleRoutes)
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

let server: http.Server | null = null; // Variable to store the server instance

// Connect to MongoDB and return the server instance
async function connectToDatabase(): Promise<http.Server | null> {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('MongoDB connection string not provided. Please set MONGODB_URI in .env file.');
    return null;
  }

  try {
    await mongoose.connect(mongoURI, {});

    console.log('Connected to MongoDB successfully');

    seedRoles();

    // Start the server and store the instance
    const port = process.env.PORT || 3000;
    server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    return server;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return null;
  }
}

// Function to close the server (for testing purposes)
function closeServer(): void {
  if (server) {
    server.close();
  }
}

connectToDatabase()

// Export the function to close the server and the app (for testing purposes)
export { closeServer, app, connectToDatabase };
