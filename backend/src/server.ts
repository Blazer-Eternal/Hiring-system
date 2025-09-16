
import express, { NextFunction, Request, Response } from 'express';
import {port, Database} from './config';

import {environment} from './config';

import router from './api/routes'
// Create an Express application
const app = express();
app.use(express.json()); 

Database.connection();

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


app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port} on ${environment} server`);
});
