import express, { Express } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routesUrls from './routes/routes';
import cors, { CorsOptions } from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import https from 'https';
import fs from 'fs';

dotenv.config();

const app: Express = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4000;
console.log("port:",PORT)

mongoose
  .connect(process.env.DATABASE_ACCESS || '')
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const corsOptions: CorsOptions = {
  origin: ['https://purple-hill-01d316503.3.azurestaticapps.net', 'https://localhost:3000'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  exposedHeaders: ['Authorization' ] 
};

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsOptions));
app.use('/', routesUrls);

// Create an HTTPS server with your SSL/TLS certificates
const httpsOptions = {
  key: fs.readFileSync('../localhost.key'),
  cert: fs.readFileSync('../localhost.crt'),
};

const httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(PORT, () => {
  console.log(`Server is running on HTTPS at https://localhost:${PORT}`);
});
