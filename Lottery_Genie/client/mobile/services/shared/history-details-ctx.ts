import { createContext } from "react";

export const UpdateHistoryDetailsCtx = createContext<{
  update_history_details: boolean;
  setUpdateHistoryDetails: (updated: boolean) => void;
}>({
  update_history_details: false,
  setUpdateHistoryDetails: (updated: boolean) => {},
});
