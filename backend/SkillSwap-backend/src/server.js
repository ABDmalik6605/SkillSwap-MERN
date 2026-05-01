import http from 'http';
import app from './app.js';
import config from './config/index.js';
import { connectDb } from './config/db.js';
import { initSocket } from './sockets/index.js';

const server = http.createServer(app);
const io = initSocket(server);
app.set('io', io);

const start = async () => {
  await connectDb();
  server.listen(config.port, () => {
    console.log(`API running on port ${config.port}`);
  });
};

start();
