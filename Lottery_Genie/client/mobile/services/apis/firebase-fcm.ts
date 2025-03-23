import api from "@/config/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useSendFCMTokenMutation = () =>
  useMutation<string & RequestError, AxiosError, string>({
    mutationFn: async (data) =>
      (await api.spring.post("/notification/register-device-token", { token: data })).data,
  });