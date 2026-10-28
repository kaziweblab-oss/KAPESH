import { connectToDatabase, disconnectFromDatabase } from "./connection";
import { syncDatabaseIndexes } from "./models";

async function main(): Promise<void> {
  await connectToDatabase();
  await syncDatabaseIndexes();
  console.log("MongoDB indexes synced.");
}

main()
  .catch((error) => {
    console.error("Index sync failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectFromDatabase();
  });
