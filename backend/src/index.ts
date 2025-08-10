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
  const port = process.env.PORT || 4000;

  // Create Apollo Server
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    introspection: true, // Enable in production for GraphQL Playground
  });

  await server.start();

  // Apply middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
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

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
    console.log(`📊 GraphQL Playground available in development mode`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});