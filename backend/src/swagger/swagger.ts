import swaggerJsdoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hiring System Management API",
      version: "1.0.0",
      description: "API documentation for Hiring System",
    },
    servers: [
      {
        url: "https://noneternally-unhomologous-desirae.ngrok-free.dev/api/v1",
        description: "Public Ngrok Server",
      },
    ],
  },

  apis: ["./src/api/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;