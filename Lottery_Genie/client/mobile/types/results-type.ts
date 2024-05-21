import { z } from "zod";
import { lotteryResultSchema } from "../validators/current-results";

export type ResultType = z.infer<typeof lotteryResultSchema>;

export type ResultsType = {
    data: ResultType[];
};