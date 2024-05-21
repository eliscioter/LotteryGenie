import axios, {type CreateAxiosDefaults} from "axios";

const axios_config: CreateAxiosDefaults = {
    baseURL: `${process.env.EXPO_PUBLIC_API_BASE_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
};

const api = axios.create(axios_config);

export default api;