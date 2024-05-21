import api from "@/config/axios";
import { ResultsType } from "@/types/results-type";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useCurrentResults = () =>
  useQuery<ResultsType & RequestError, AxiosError>({
    queryKey: ["current-results"],
    queryFn: async () => {
        try {
            const response = await api.get('/fetch');
            return response.data;
          } catch (error) {
            if (error instanceof AxiosError) {
              console.error('Axios Errors:', error);
              throw error;
            } else {
              console.error('Unexpected Error:', error);
            }
          }
    },
  });
