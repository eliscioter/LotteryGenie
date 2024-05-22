import { z } from "zod";
import { InputSchema, lotteryResultSchema } from "../validators/current-results";

export type ResultType = z.infer<typeof lotteryResultSchema>;

export type ResultsType = {
    data: ResultType[];
};

export type LottoDetails = z.infer<typeof InputSchema>;