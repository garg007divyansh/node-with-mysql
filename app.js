import express from 'express';
import loader from './src/loaders/index.js';
import { createServer } from "http";
import { initializeSocket } from './src/sockets/index.js';

const app = express();
loader(app);

// // Create an HTTP server
const server = createServer(app);

// //socket connection
export const io = initializeSocket(server);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
