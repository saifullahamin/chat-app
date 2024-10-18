import app from './app';
import sequelize from './config/database';
import http from 'http';
import dotenv from 'dotenv';
import { defineAssociations } from './models/associations';
import { initializeSocket } from './socket';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initializeSocket(server);

sequelize.sync().then(() => {
  defineAssociations();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
