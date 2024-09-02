import { LottoCombination } from "@/types/results-type";
import { createContext } from "react";

export const UpdateHistoryDetailsCtx = createContext<{
  update_history_details: LottoCombination[];
  setUpdateHistoryDetails: (updated: LottoCombination[]) => void;
}>({
  update_history_details: [],
  setUpdateHistoryDetails: (updated: LottoCombination[]) => {},
});
