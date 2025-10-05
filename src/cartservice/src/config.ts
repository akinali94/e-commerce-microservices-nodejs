import "dotenv/config";

export type Env = {
  port: number;
  backend: "redis" | "pg" | "spanner" | "memory";
  // redis
  redisAddr?: string;
  redisPassword?: string;
  redisDb?: number;
  // pg (future)
  pg?: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
};

export function loadEnv(): Env {
  const port = parseInt(process.env.PORT ?? "8080", 10);
  const backend = (process.env.CART_BACKEND ?? inferBackend()).toLowerCase() as Env["backend"];

  const [host = "127.0.0.1", portStr = "6379"] = (process.env.REDIS_ADDR ?? "").split(":");
  const redisAddr = process.env.REDIS_ADDR;
  const redisPassword = process.env.REDIS_PASSWORD;
  const redisDb = process.env.REDIS_DB ? parseInt(process.env.REDIS_DB, 10) : undefined;

  const pg = process.env.PG_HOST
    ? {
        host: process.env.PG_HOST!,
        port: parseInt(process.env.PG_PORT ?? "5432", 10),
        user: process.env.PG_USER ?? "postgres",
        password: process.env.PG_PASSWORD ?? "postgres",
        database: process.env.PG_DATABASE ?? "cartdb"
      }
    : undefined;

  return { port, backend, redisAddr, redisPassword, redisDb, pg };
}

// Mimic .NET selection precedence if you like; simple heuristic here:
function inferBackend(): Env["backend"] {
  if (process.env.REDIS_ADDR) return "redis";
  if (process.env.PG_HOST) return "pg";
  // if (process.env.SPANNER_PROJECT || process.env.SPANNER_CONNECTION_STRING) return "spanner";
  return "memory";
}

export function redisUrlFromEnv(e: Env): string | undefined {
  if (!e.redisAddr) return undefined;
  const [host, port] = e.redisAddr.split(":");
  const auth = e.redisPassword ? `:${encodeURIComponent(e.redisPassword)}@` : "";
  const db = Number.isFinite(e.redisDb) ? `/${e.redisDb}` : "";
  return `redis://${auth}${host}:${port}${db}`;
}
