import { ResultsType } from "@/types/results-type";
import { create } from "zustand";

interface ResultStore {
    result: Nullable<ResultsType>;
    setResult: (result: ResultsType) => void;
    clearResult: () => void;
}

export const useCurrentResultStore = create<ResultStore>()(
    (set): ResultStore => ({
        result: null,
        setResult: (result) => set((state) => ({ ...state, result })),
        clearResult: () => set((state) => ({ ...state, result: null })),
    })
);