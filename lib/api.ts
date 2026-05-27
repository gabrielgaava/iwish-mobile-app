import { getValueFor, storageValue } from "@/lib/storage";
import { SessionStorage } from "@/types/IAuth";
import { default as axios, AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const AUTH_PREFIX = "Bearer ";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const AUTH_STORAGE_KEY = "iWishApp-AuthState";

export type ApiSuccess<T> = T;

export type ApiFailure = {
  code: string;
  message: string;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshSessionPromise: Promise<SessionStorage> | null = null;

export const setApiAuthorization = (token?: string) => {
  api.defaults.headers.common["Authorization"] = token
    ? `${AUTH_PREFIX}${token}`
    : undefined;
};

async function getStoredSession() {
  const data = await getValueFor(AUTH_STORAGE_KEY);

  if (!data) {
    return null;
  }

  return JSON.parse(data) as SessionStorage;
}

async function refreshStoredSession() {
  const storedSession = await getStoredSession();

  if (!storedSession?.refreshToken) {
    throw new Error("Missing refresh token");
  }

  const response = await axios.post<Pick<SessionStorage, "accessToken" | "refreshToken" | "expiration">>(
    `${BASE_URL}/auth/refresh`,
    { refreshToken: storedSession.refreshToken }
  );

  const nextSession: SessionStorage = {
    ...storedSession,
    ...response.data,
    isLoggedIn: true,
  };

  await storageValue(AUTH_STORAGE_KEY, nextSession);
  setApiAuthorization(nextSession.accessToken);

  return nextSession;
}

// Whenever a API Response returns with Expired Token Code, the axios
// Will refresh the token and do the request again
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ApiFailure>) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const isTokenExpired = error.response?.data?.code === "TOKEN_EXPIRED";
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh");

    if (isTokenExpired && originalRequest && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        refreshSessionPromise = refreshSessionPromise || refreshStoredSession();
        const nextSession = await refreshSessionPromise;
        refreshSessionPromise = null;

        originalRequest.headers.Authorization = `${AUTH_PREFIX}${nextSession.accessToken}`;
        return api(originalRequest);
      }
      catch (refreshError) {
        refreshSessionPromise = null;
        await storageValue(AUTH_STORAGE_KEY, null);
        setApiAuthorization(undefined);
        return Promise.resolve(error.response);
      }
    }

    if (error.response?.data) {
      return Promise.resolve(error.response);
    }

    return Promise.resolve({
      code: "NETWORK_ERROR",
      message: "Unable to reach server",
    } satisfies ApiFailure);
  }
);

// Validate if the axios response is a 'OK' Status Code
export const isOkay = (response: AxiosResponse) => {
  return response.status < 300 && response.status > 199
}
