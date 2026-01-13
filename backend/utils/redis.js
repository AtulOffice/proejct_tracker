import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is missing in .env");
}

const redis = new Redis(process.env.REDIS_URL, {
    tls: process.env.REDIS_URL.startsWith("rediss://")
        ? { rejectUnauthorized: false }
        : undefined,
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));

export const connectRedis = async () => {
  await redis.ping();
};

export default redis;



// import Redis from "ioredis";
// import dotenv from "dotenv";
// dotenv.config();

// if (!process.env.REDIS_URL) throw new Error("REDIS_URL missing");

// const redis = new Redis(process.env.REDIS_URL, {
//   tls: process.env.REDIS_URL.startsWith("rediss://") ? {} : undefined,
// });

// redis.on("connect", () => console.log("✅ Redis connected"));
// redis.on("error", (err) => console.log("❌ Redis error", err));

// async function redisOperations() {
//   // ✅ SET
//   await redis.set("name", "Atul");
//   await redis.set("session:user1", JSON.stringify({ id: 1, role: "admin" }), "EX", 60); // expire 60 sec

//   // ✅ GET
//   const name = await redis.get("name");
//   console.log("GET name:", name);

//   const session = await redis.get("session:user1");
//   console.log("GET session:", JSON.parse(session));

//   // ✅ EXISTS
//   const exists = await redis.exists("name"); // 1 or 0
//   console.log("EXISTS name:", exists);

//   // ✅ TTL (time left)
//   const ttl = await redis.ttl("session:user1");
//   console.log("TTL session:user1:", ttl);

//   // ✅ DELETE (DEL)
//   await redis.del("name");
//   console.log("Deleted key: name");

//   // ✅ LIST KEYS (debug only)
//   const keys = await redis.keys("*");
//   console.log("All keys:", keys);

//   // ✅ DELETE by Pattern (example: delete all session keys)
//   const sessionKeys = await redis.keys("session:*");
//   if (sessionKeys.length > 0) {
//     await redis.del(...sessionKeys);
//     console.log("Deleted session keys:", sessionKeys);
//   }

//   // ✅ CLOSE connection
//   await redis.quit();
// }

// redisOperations();
