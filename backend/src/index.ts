import express from 'express';
import http from 'http';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { prisma } from './prisma/client';
import { authMiddleware } from './auth/middleware';
import { setupSocket } from './socket';

dotenv.config();

const app = express();
app.use(cors());
// app.use(express.json());  - causes error
app.use(authMiddleware);

const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: '*' },
});

// Attach io to app for access in resolvers
app.set('io', io);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, prisma, io }),
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  httpServer.listen(4000, () => {
    console.log('🚀 Server ready at http://localhost:4000/graphql');
  });
}

startServer();

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

setupSocket(io); 