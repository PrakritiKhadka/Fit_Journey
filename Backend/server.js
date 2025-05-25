import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import routes from "./routes/route.js";
import { connectDB } from "./config/db.config.js";
import { corsOptions } from "./config/cors.config.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { swaggerOptions } from "./config/swagger.config.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(bodyParser.json());

    app.use("/api", routes);

    app.get("/", (req, res) => res.send("Fitness Tracker API is running"));
    app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

    app.get("/swagger.json", (req, res) => {
      res.json(swaggerJSDoc(swaggerOptions)); // Return the OpenAPI JSON spec
    });

    app.use(
      "/swagger",
      swaggerUi.serve,
      swaggerUi.setup(swaggerJSDoc(swaggerOptions))
    );

    app.get("/docs", (req, res) => {
      res.send(`
        <!doctype html>
<html>
  <head>
    <title>Scalar API Reference</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1" />
  </head>

  <body>
    <div id="app"></div>

    <!-- Load the Script -->
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>

    <!-- Initialize the Scalar API Reference -->
    <script>
      Scalar.createApiReference('#app', {
        // The URL of the OpenAPI/Swagger document
        url: "http://localhost:${PORT}/swagger.json",
        // Avoid CORS issues
        proxyUrl: 'https://proxy.scalar.com',
      })
    </script>
  </body>
</html>
      `);
    });

    // Error Handling Routes
    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`--------------------------------------------------`);
      console.log(`|                                                 |`);
      console.log(`|             FIT JOURNEY BACKEND                 |`);
      console.log(`|                                                 |`);
      console.log(`|        Server running on port ${PORT}              |`);
      console.log(`--------------------------------------------------`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();