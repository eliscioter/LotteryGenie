import { createContext } from "react";

export interface CombCtxType {
  input_combination: { value: string }[];
  setInputCombination: (input_combination: { value: string }[]) => void;
  clearInputCombination: () => void;
}

export const CombCtx = createContext<CombCtxType>({
  input_combination: [],
  setInputCombination: (input_combination: { value: string }[]) => {},
  clearInputCombination: () => {},
});
