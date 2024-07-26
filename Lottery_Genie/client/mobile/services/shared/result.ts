import { ResultType } from "@/types/results-type";
import { create } from "zustand";

interface ResultStore {
    result: Nullable<ResultType>;
    setResult: (result: ResultType) => void;
    clearResult: () => void;
}

export const useCurrentResultStore = create<ResultStore>()(
    (set): ResultStore => ({
        result: null,
        setResult: (result) => set((state) => ({ ...state, result })),
        clearResult: () => set((state) => ({ ...state, result: null })),
    })
);