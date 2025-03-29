import { LottoCombination } from "@/types/results-type";
import { db, lotto_combinations_table } from "./loadDatabase";

export const addHistory = async (
  category: string,
  combination: string[],
  input_date: string
) => {
  try {

    if (!db) {
      console.error("Database not initialized");
      return false;
    }

    const combination_string = JSON.stringify(combination);
    await db.runAsync(
      `INSERT INTO ${lotto_combinations_table} (category, combination, input_date, created_at) VALUES (?, ?, ?, ?)`,
      [category, combination_string, input_date, new Date().toISOString()]
    );

    return true;
  } catch (error) {
    console.error("Error adding history", error);
    return false;
  }
};

export const fetchHistory = async () => {
  try {
    if (!db) {
      console.error("Database not initialized");
      return [];
    }

    const results: LottoCombination[] = await db.getAllAsync(
      `SELECT * FROM ${lotto_combinations_table}`
    );

    return results;
  } catch (error) {
    console.error("Error fetching history", error);
    return [];
  }
};

export const deleteItemHistory = async (item_id: string) => {
  try {
    if (!db) {
      console.error("Database not initialized");
      return false;
    }

    await db.runAsync(
      `DELETE FROM ${lotto_combinations_table} WHERE id = ?`,
      [item_id]
    );
    return true;
  } catch (error) {
    console.error("Error deleting item", error);
    return false;
  }
}
