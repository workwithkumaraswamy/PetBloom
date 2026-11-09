require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🐾 PetBloom — The Art of Premium Pet Care`);
  console.log(`✨ Server active on port ${PORT}`);
  console.log(`🌿 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server terminated.');
  });
});
