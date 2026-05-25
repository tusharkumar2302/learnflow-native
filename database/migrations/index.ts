// Migration runner stub.
// When expo-sqlite is integrated, call runMigrations() on app launch.

import { db } from "../sqlite";
import { SCHEMA_SQL } from "../schema";

export async function runMigrations(): Promise<void> {
  if (!db) return; // SQLite not yet connected
  // db.execSync(SCHEMA_SQL);
}
