import { createApp } from "./app.js";
import { ServiceConfig } from "./types.js";

// Load configuration from environment variables
const config: ServiceConfig = {
  cartServiceAddr: process.env.CART_SERVICE_ADDR || "http://localhost:7070",
  productCatalogServiceAddr: process.env.PRODUCT_CATALOG_SERVICE_ADDR || "http://localhost:3550",
  currencyServiceAddr: process.env.CURRENCY_SERVICE_ADDR || "http://localhost:7000",
  shippingServiceAddr: process.env.SHIPPING_SERVICE_ADDR || "http://localhost:50051",
  paymentServiceAddr: process.env.PAYMENT_SERVICE_ADDR || "http://localhost:50052",
  emailServiceAddr: process.env.EMAIL_SERVICE_ADDR || "http://localhost:8080",
};

const PORT = process.env.PORT || 5050;

// Create and start server
const app = createApp(config);

app.listen(PORT, () => {
  console.log({
    timestamp: new Date().toISOString(),
    severity: "INFO",
    message: `Checkout service listening on port ${PORT}`,
    config: {
      cartService: config.cartServiceAddr,
      productCatalogService: config.productCatalogServiceAddr,
      currencyService: config.currencyServiceAddr,
      shippingService: config.shippingServiceAddr,
      paymentService: config.paymentServiceAddr,
      emailService: config.emailServiceAddr,
    },
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  process.exit(0);
});