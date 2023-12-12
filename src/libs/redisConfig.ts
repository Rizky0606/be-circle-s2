import { createClient } from "redis";

const client = createClient({
  password: "FKlBdWow77LOu2tKw20ukHgajx5cGdPr",
  socket: {
    host: "redis-15057.c295.ap-southeast-1-1.ec2.cloud.redislabs.com",
    port: 15057,
  },
});

client.on("error", (error) => {
  console.log("Redis Client", error);
  process.exit();
});

export async function redisConnect() {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.log("Redis Error ", error);
    process.exit(1);
  }
}

const DEFAULT_EXPIRATION = 60 * 60 * 24;

export { client, DEFAULT_EXPIRATION };
