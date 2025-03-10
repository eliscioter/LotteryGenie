import { LottoCombination } from "@/types/results-type";
import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";

export const db_name = "lottery_genie.db";

export const db_table = "lotto_combinations";

export const loadDatabase = async () => {
  try {
    const db = await openDatabaseAsync(db_name);

    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS ${db_table} (
        id INTEGER PRIMARY KEY, 
        category TEXT, 
        combination JSON, 
        input_date TEXT, 
        created_at TEXT
        )`
    );

    return true;
  } catch (error) {
    console.error("Error creating table", error);
    return false;
  }
};

export const addHistory = async (
  db: SQLiteDatabase,
  category: string,
  combination: string[],
  input_date: string
) => {
  try {
    const combination_string = JSON.stringify(combination);
    await db.runAsync(
      `INSERT INTO ${db_table} (category, combination, input_date, created_at) VALUES (?, ?, ?, ?)`,
      [category, combination_string, input_date, new Date().toISOString()]
    );

    return true;
  } catch (error) {
    console.error("Error adding history", error);
    return false;
  }
};

export const fetchHistory = async (db: SQLiteDatabase) => {
  try {
    const results: LottoCombination[] = await db.getAllAsync(
      `SELECT * FROM ${db_table}`
    );

    return results;
  } catch (error) {
    console.error("Error fetching history", error);
    return [];
  }
};
