import express, { Express, Request, Response, NextFunction } from "express";
import { CheckoutService } from "./service.js";
import { ServiceConfig } from "./types.js";
import { checkoutRouter } from "./route.js";

export function createApp(config: ServiceConfig): Express {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log({
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration: `${duration}ms`,
      });
    });
    next();
  });

  // Initialize service
  const checkoutService = new CheckoutService(config);

  // Routes
  app.use("/api/checkout", checkoutRouter({ service: checkoutService }));

  // Root endpoint
  app.get("/", (req: Request, res: Response) => {
    res.json({
      service: "checkoutservice",
      version: "1.0.0",
      endpoints: {
        placeOrder: "POST /api/checkout/order",
        health: "GET /api/checkout/health",
      },
    });
  });

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: "Not Found",
      message: `Cannot ${req.method} ${req.path}`,
    });
  });

  // Error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  });

  return app;
}