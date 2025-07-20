import "reflect-metadata";
import express, { NextFunction } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source.ts";
import userRouter from "./routes/user-routes.ts";
import { HttpError } from "./utils/errors.ts";
import swaggerUi from "swagger-ui-express";
import { Request, Response } from "express";
import { swaggerSpec } from "./swagger.ts";

dotenv.config({ quiet: true });

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/users", userRouter);

app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(error);

  if (error instanceof HttpError) {
    return res.status(error.code).json({ message: error.message });
  }

  res.status(500).json({ message: "An unexpected error occurred." });
});

export { app };

if (process.env.NODE_ENV !== "test") {
  AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
      });
    })
    .catch((err) => {
      console.error("Error during Data Source initialization:", err);
      process.exit(1);
    });
}
