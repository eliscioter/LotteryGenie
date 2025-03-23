import axios, {type CreateAxiosDefaults} from "axios";

const axios_config: CreateAxiosDefaults = {
    baseURL: `${process.env.EXPO_PUBLIC_API_BASE_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
};
const axios_config_spring: CreateAxiosDefaults = {
    baseURL: `${process.env.EXPO_PUBLIC_API_SPRING_BASE_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
};

const django = axios.create(axios_config);

const spring = axios.create(axios_config_spring);

const apis = {
    django,
    spring,
  };
  
  export default apis;