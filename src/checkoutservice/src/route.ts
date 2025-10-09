import { Router } from "express";
import { CheckoutService } from "./service.js";
import { placeOrderController, healthCheckController } from "./controller.js";

interface RouteDeps {
  service: CheckoutService;
}

export function checkoutRouter(deps: RouteDeps): Router {
  const router = Router();

  // POST /api/checkout/order - Place an order
  router.post("/order", placeOrderController({ service: deps.service }));

  // GET /api/checkout/health - Health check
  router.get("/health", healthCheckController());

  return router;
}