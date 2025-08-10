import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { prisma } from './lib/prismaClient';
import { Context } from './types';

dotenv.config();

async function startServer() {
  const app = express();
  const port = parseInt(process.env.PORT || '4000', 10);
  const host = process.env.HOST || '0.0.0.0';
  
  // Configure base URLs from environment variables
  const frontendHost = process.env.FRONTEND_HOST || 'localhost';
  const frontendPort = process.env.FRONTEND_PORT || '3001';
  const frontendProtocol = process.env.FRONTEND_PROTOCOL || 'http';
  const backendHost = process.env.BACKEND_HOST || 'localhost';
  const backendProtocol = process.env.BACKEND_PROTOCOL || 'http';
  
  // Build URLs dynamically
  const frontendUrl = process.env.FRONTEND_URL || `${frontendProtocol}://${frontendHost}:${frontendPort}`;
  const backendUrl = process.env.BACKEND_URL || `${backendProtocol}://${backendHost}:${port}`;
  
  // Configure CORS origins from environment variables
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [
        frontendUrl,
        `${frontendProtocol}://${frontendHost}:3000`, // Fallback port
        `${frontendProtocol}://${frontendHost}:${frontendPort}`,
        backendUrl,
        // Default development origins (only if using localhost)
        ...(frontendHost === 'localhost' ? [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:4000'
        ] : [])
      ];

  console.log('🌐 CORS enabled for origins:', allowedOrigins);

  // Create Apollo Server
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    introspection: true, // Enable in production for GraphQL Playground
  });

  await server.start();

  // Configure CORS options
  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies and credentials
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-user-id',
      'Apollo-Require-Preflight'
    ],
  };

  // Apply middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(corsOptions),
    express.json({ limit: '10mb' }),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Mock authentication - get user ID from header
        const userId = req.headers['x-user-id'] as string;
        
        let user = null;
        if (userId) {
          try {
            user = await prisma.user.findUnique({
              where: { id: userId }
            });
          } catch (error) {
            console.warn('User not found:', userId);
          }
        }

        return {
          prisma,
          user,
        };
      },
    }),
  );

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  app.listen(port, host, () => {
    console.log('\n🚀 EdTech Backend Server Started!');
    console.log(`📡 GraphQL endpoint: ${backendUrl}/graphql`);
    console.log(`🏥 Health check: ${backendUrl}/health`);
    console.log(`🌐 Frontend URL: ${frontendUrl}`);
    console.log(`🖥️  Server binding: ${host}:${port}`);
    console.log(`📊 GraphQL introspection: ${process.env.ENABLE_INTROSPECTION !== 'false' ? 'enabled' : 'disabled'}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('✅ Ready to accept requests!\n');
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});