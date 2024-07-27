import { createContext } from "react";

export const CombCtx = createContext({
  input_combination: ["", "", "", "", "", ""],
  setInputCombination: (input_combination: string[]) => {},
  clearInputCombination: () => {},
});
