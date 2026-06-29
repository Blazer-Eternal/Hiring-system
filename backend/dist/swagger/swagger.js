"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Hiring System Management API",
            version: "1.0.0",
            description: "API documentation for Hiring System",
        },
        servers: [
            {
                url: "https://hypnotic-thank-overfill.ngrok-free.dev/api/v1",
                description: "Public Ngrok Server",
            },
        ],
    },
    apis: ["./src/api/routes/*.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
