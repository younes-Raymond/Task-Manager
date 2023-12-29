const app = require('./app');
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary');
const { v4: uuidv4 } = require('uuid');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 4000;

// Create an HTTP server
const httpServer = http.createServer(app);

// Use CORS middleware
app.use(cors());

// Create a Socket.IO server attached to the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Handle Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle 'message' event
  socket.on('message', (data) => {
    console.log('Received message:', data);

    // Broadcast the message to all connected clients
    io.emit('message', data);
  });

  // Handle 'disconnect' event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Handle uncaughtException Error
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

// Connect to the database
connectDatabase();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Start the HTTP server
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the Express app
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
