const app = require('./app');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB().catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`\n================================`);
  console.log(`✓ Server is running`);
  console.log(`✓ Host: ${HOST}`);
  console.log(`✓ Port: ${PORT}`);
  console.log(`✓ URL: http://localhost:${PORT}`);
  console.log(`================================\n`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = server;
