import { createContext } from "react";

export const CombCtx = createContext({
  input_combination: [{ value: "" }],
  setInputCombination: (input_combination: {value: string}[]) => {},
  clearInputCombination: () => {},
});
