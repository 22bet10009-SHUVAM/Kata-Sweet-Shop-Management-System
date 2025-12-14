import express, { Application } from 'express';
import path from 'path';
import cors from 'cors';
import config from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware';

/**
 * Create Express application
 */
const createApp = (): Application => {
  const app = express();

  // CORS configuration - allow multiple origins for production
  const allowedOrigins = [
    config.frontendUrl,
    'http://localhost:5173',
    'http://localhost:3000'
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        // Allow any netlify.app subdomain
        if (origin.endsWith('.netlify.app') || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        
        callback(null, true); // Allow all origins in development
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.use('/api', routes);

  // Static uploads
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Kata API',
      version: '1.0.0',
      documentation: '/api/health'
    });
  });

  // Error handling middleware
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
