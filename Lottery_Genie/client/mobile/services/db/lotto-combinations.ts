import { openDatabaseAsync } from "expo-sqlite";

export const db_name = "lottery_genie.db";

const db_table = "lotto_combinations";

export const loadDatabase = async () => {
  try {
    const db = await openDatabaseAsync(db_name);


    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS ${db_table} (
        id INTEGER PRIMARY KEY, 
        category TEXT, 
        combination TEXT, 
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
  category: string,
  combination: string,
  input_date: string
) => {
  try {
    const db = await openDatabaseAsync(db_name);


    await db.runAsync(
      `INSERT INTO ${db_table} (category, combination, input_date, created_at) VALUES (?, ?, ?, ?)`,
      [category, combination, input_date, new Date().toISOString()]
    );

    return true;
  } catch (error) {
    console.error("Error adding history", error);
    return false;
  }
};

export const fetchHistory = async () => {
    try {
        const db = await openDatabaseAsync(db_name);
    
        const [results] = await db.getAllAsync(`SELECT * FROM ${db_table}`);
    
        return results;
    } catch (error) {
        console.error("Error fetching history", error);
        return [];
    }
    }
