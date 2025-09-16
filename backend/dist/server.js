"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const config_2 = require("./config");
const routes_1 = __importDefault(require("./api/routes"));
// Create an Express application
const app = (0, express_1.default)();
app.use(express_1.default.json());
config_1.Database.connection();
app.use('/api/v1', routes_1.default);
// Define a route for the root path ('/')
app.get('/', (req, res) => {
    // Send a response to the client
    res.send('Hello, TypeScript + Node.js + Express!');
});
// error handeling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: err.message,
    });
});
app.listen(config_1.port, () => {
    // Log a message when the server is successfully running
    console.log(`Server is running on http://localhost:${config_1.port} on ${config_2.environment} server`);
});
