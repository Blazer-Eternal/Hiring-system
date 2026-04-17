"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger/swagger"));
const config_1 = require("./config");
const config_2 = require("./config");
const routes_1 = __importDefault(require("./api/routes"));
const cors_1 = __importDefault(require("cors"));
// Create an Express application
const app = (0, express_1.default)();
// CORS
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"]
}));
app.set("trust proxy", true);
app.use(express_1.default.json());
app.use("/api/v1/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
config_1.Database.connection();
app.options("*", (0, cors_1.default)());
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
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    // Log a message when the server is successfully running
    console.log(`Server is running on http://localhost:${config_1.port} on ${config_2.environment} server`);
});
