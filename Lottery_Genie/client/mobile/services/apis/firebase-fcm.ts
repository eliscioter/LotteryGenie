import api from "@/config/axios";
import { FCMTokenType } from "@/types/fcm-token-type";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useSendFCMTokenMutation = () =>
  useMutation<string & RequestError, AxiosError, FCMTokenType>({
    mutationFn: async (data) =>
      (await api.spring.post("/notification/register-device-token", data)).data,
  });