import 'dotenv/config';
import connectDB from './config/db.js';
import { server } from './socket/socket.js';

const start = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log('running on port : ' + PORT));
};

start();