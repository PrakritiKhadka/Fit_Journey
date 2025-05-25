import { configDotenv } from "dotenv";

configDotenv();

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fitness Tracker API",
      version: "1.0.0",
      description: "API documentation for the Fitness Tracker application",
      contact: {
        name: "Prakriti Khadka",
        email: "prakriti@gmail.com",
      },
    },
    externalDocs: {
      description: "Find Source Code At",
      url: "https://github.com/PrakritiKhadka/FitJourney",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ['../routes/auth.js','./routes/*.js'], // Path to the API docs
};
