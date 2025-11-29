import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const cwd = process.cwd();
const envLocalPath = path.join(cwd, '.env.local');
const envPath = fs.existsSync(envLocalPath) ? envLocalPath : path.join(cwd, '.env');

dotenv.config({ path: envPath });

import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';

const port = process.env.PORT || 5000;

const bootstrap = async () => {
  try {
    await connectDB();
    configureCloudinary();

    const server = http.createServer(app);

    server.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`API server running on port ${port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Startup Error:', error);
    process.exit(1);
  }
};

bootstrap();
