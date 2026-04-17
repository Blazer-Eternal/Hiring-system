
import express, { NextFunction, Request, Response } from 'express';

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swagger";
import {port, Database} from './config';

import {environment} from './config';

import router from './api/routes';

import cors from "cors";


// Create an Express application
const app = express();
// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"]
}))

app.set("trust proxy", true);
app.use(express.json()); 

app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
Database.connection();



app.options("*", cors());



app.use('/api/v1',router);


// Define a route for the root path ('/')
app.get('/', (req, res) => {
  // Send a response to the client
  res.send('Hello, TypeScript + Node.js + Express!');
});

// error handeling middleware
app.use((err: Error, req: Request, res: Response, next:NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message,
  });
});

const PORT: any = process.env.PORT || 5001

app.listen(PORT,() => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port} on ${environment} server`);
});


