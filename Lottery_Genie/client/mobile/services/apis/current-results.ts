import api from "@/config/axios";
import { LottoDetails, ResultsType } from "@/types/results-type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useCurrentResults = () =>
  useQuery<ResultsType & RequestError, AxiosError>({
    queryKey: ["current-results"],
    queryFn: async () => {
      try {
        const response = await api.django.get("/fetch");
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Axios Errors:", error);
          throw error;
        } else {
          console.error("Unexpected Error:", error);
        }
      }
    },
  });

export const useCheckCombinationMutation = () =>
  useMutation<(ResultsType & {"correlation_id": string}) & RequestError, AxiosError, LottoDetails>({
    mutationFn: async (data) =>
      (await api.django.post("/check-combinations", data)).data,
  });
