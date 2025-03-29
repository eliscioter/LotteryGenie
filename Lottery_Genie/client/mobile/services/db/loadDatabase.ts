import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";

export const db_name = "lottery_genie.db";

export const lotto_combinations_table = "lotto_combinations";

export const fcm_token_table = "fcm_token";

export let db: SQLiteDatabase | null = null;
export const loadDatabase = async () => {
  try {
    db = await openDatabaseAsync(db_name);

    await createLottoCombinationsTable();
    await createFCMTokenTable();
    
    return true;
  } catch (error) {
    console.error("Error creating table", error);
    return false;
  }
};

async function  createLottoCombinationsTable() {
  try {
    if (!db) {
      console.error("Database not initialized");
      return;
    }

    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS ${lotto_combinations_table} (
        id INTEGER PRIMARY KEY, 
        category TEXT, 
        combination JSON, 
        input_date TEXT, 
        created_at TEXT
        )`
    );
  } catch (error) {
    console.error(`Error creating ${lotto_combinations_table} table`, error);
  }
}

async function createFCMTokenTable() {
  try {
    if (!db) {
      console.error("Database not initialized");
      return;
    }

    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS ${fcm_token_table} (
        id INTEGER PRIMARY KEY,
        fcm_token TEXT,
        created_at TEXT,
        updated_at TEXT
      )`
    )
  } catch(error) {
    console.error(`Error creating ${fcm_token_table} table`, error);
  }
}