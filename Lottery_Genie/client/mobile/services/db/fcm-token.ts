import { FCMTokenType } from "@/types/fcm-token-type";
import { db, fcm_token_table } from "./loadDatabase";

export const addFCMToken = async (
  tokens: FCMTokenType
) => {
  try {

    if (!db) {
      console.error("Database not initialized");
      return false;
    }

    await db.runAsync(
      `INSERT INTO ${fcm_token_table} (fcm_token, correlation_token, created_at) VALUES (?, ?, ?)`,
      [tokens.fcm_token, tokens.correlation_token, new Date().toISOString()]
    );

    return true;
  } catch (error) {
    console.error("Error adding fcm token", error);
    return false;
  }
};

export const fetchFCMToken = async () => {
  try {
    if (!db) {
      console.error("Database not initialized");
      return [];
    }

    const result: FCMTokenType | null = await db.getFirstAsync(
      `SELECT fcm_token FROM ${fcm_token_table}`
    );

    return result?.fcm_token;
  } catch (error) {
    console.error("Error fetching fcm history", error);
    return [];
  }
};