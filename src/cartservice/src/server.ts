import { createApp } from "./app.js";
import { loadEnv, redisUrlFromEnv } from "./config.js";
import { createMemoryStore } from "./adapters/memoryStore.js";
import { createRedisStore } from "./adapters/redisStore.js";
// import { createPgStore } from "./adapters/pgStore.js";
// import { createSpannerStore } from "./adapters/spannerStore.js";

const env = loadEnv();

async function selectStore() {
  switch (env.backend) {
    case "redis": {
      const url = redisUrlFromEnv(env);
      if (!url) throw new Error("REDIS_ADDR missing");
      return await createRedisStore({ url });
    }
    case "pg": {
      // return createPgStore();
      throw new Error("PG backend not implemented yet");
    }
    case "spanner": {
      // return createSpannerStore();
      throw new Error("Spanner backend not implemented yet");
    }
    default:
      return createMemoryStore();
  }
}

async function start() {
  try {
    const store = await selectStore();
    const app = createApp({ store });
    app.listen(env.port, () => {
      console.log(`Cart service listening on :${env.port} using backend=${env.backend}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
