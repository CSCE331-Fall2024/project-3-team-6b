import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { db } from './config/db';
//import orderRoutes from './routes/orders';
import menuRoutes from './routes/menu';
import authRoutes from './routes/authRoutes'; // Import the auth routes
import employeeRoutes from './routes/employees'
import dotenv from 'dotenv';
import { startAIChatServer } from './aiChatServer'; // We'll create this file

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// Configure session middleware
app.use(
  // @ts-ignore
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    },
  })
);

// Initialize Passport
// @ts-ignore
app.use(passport.initialize());
app.use(passport.session());

// Database connection test on startup
async function initializeDatabase() {
  try {
    const connected = await db.testConnection();
    if (!connected) {
      throw new Error('Failed to connect to database');
    }
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// Initialize database
initializeDatabase();

// Routes
//app.use('/api/orders', orderRoutes);
app.use('/api/menu-items', menuRoutes);
app.use('/api/employees', employeeRoutes)
app.use('/auth', authRoutes); // Add the auth routes

// Health check endpoint that includes database status
app.get('/health', async (req: Request, res: Response) => {
  try {
    await db.query('SELECT 1');
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: err.message || 'Unknown error occurred',
    });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Main server running on port ${PORT}`);
  // Start AI Chat server
  startAIChatServer();
});


// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error);
  try {
    await db.close();
  } catch (closeError) {
    console.error('Error closing database connection:', closeError);
  }
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing HTTP server and database connections...');
  try {
    await db.close();
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  try {
    await db.close();
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});

export default app;