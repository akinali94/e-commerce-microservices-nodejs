import { Request, Response } from "express";
import { CheckoutService } from "./service.js";
import { PlaceOrderRequest } from "./types.js";

interface ControllerDeps {
  service: CheckoutService;
}

export function placeOrderController(deps: ControllerDeps) {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const orderRequest: PlaceOrderRequest = req.body;

      // Validate request
      if (!orderRequest.userId) {
        res.status(400).json({
          error: "Bad Request",
          message: "userId is required",
        });
        return;
      }

      if (!orderRequest.userCurrency) {
        res.status(400).json({
          error: "Bad Request",
          message: "userCurrency is required",
        });
        return;
      }

      if (!orderRequest.address) {
        res.status(400).json({
          error: "Bad Request",
          message: "address is required",
        });
        return;
      }

      if (!orderRequest.email) {
        res.status(400).json({
          error: "Bad Request",
          message: "email is required",
        });
        return;
      }

      if (!orderRequest.creditCard) {
        res.status(400).json({
          error: "Bad Request",
          message: "creditCard is required",
        });
        return;
      }

      // Place order
      const response = await deps.service.placeOrder(orderRequest);

      res.status(200).json(response);
    } catch (error) {
      console.error("Error placing order:", error);

      if (error instanceof Error) {
        // Check for specific error types
        if (error.message.includes("cart")) {
          res.status(400).json({
            error: "Cart Error",
            message: error.message,
          });
          return;
        }

        if (error.message.includes("charge") || error.message.includes("card")) {
          res.status(402).json({
            error: "Payment Failed",
            message: error.message,
          });
          return;
        }

        if (error.message.includes("shipping")) {
          res.status(503).json({
            error: "Shipping Unavailable",
            message: error.message,
          });
          return;
        }
      }

      res.status(500).json({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}

export function healthCheckController() {
  return (req: Request, res: Response): void => {
    res.status(200).json({
      status: "SERVING",
      service: "checkoutservice",
    });
  };
}