import { default as axios, AxiosError, AxiosInstance, AxiosResponse } from "axios";

const AUTH_PREFIX = "Bearer ";
const BASE_URL = "https://9dae-179-102-47-97.ngrok-free.app";

export type ApiSuccess<T> = T;

export type ApiFailure = {
  code: string;
  message: string;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const setApiAuthorization = (token?: string) => {
  api.defaults.headers.common["Authorization"] = token
    ? `${AUTH_PREFIX}${token}`
    : undefined;
};

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiFailure>) => {
    if (error.response?.data) {
      return Promise.resolve(error.response);
    }

    return Promise.resolve({
      code: "NETWORK_ERROR",
      message: "Unable to reach server",
    } satisfies ApiFailure);
  }
);

export const isOkay = (response: AxiosResponse) => {
  return response.status < 300 && response.status > 199
}