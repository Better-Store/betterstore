import axios, { AxiosError, AxiosResponse } from "axios";

const API_BASE_URL = "https://v1.betterstore.io";

// Define consistent error interface
export interface ApiError {
  isError: true;
  status: number;
  message: string;
  code?: string;
  details?: unknown;
}

export const createApiClient = (apiKey: string, proxy?: string) => {
  const client = axios.create({
    baseURL: proxy ?? API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  });

  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.NODE_ENV === "development") {
    client.interceptors.request.use((config) => {
      console.log("Request method:", config.method);
      console.log("Request URL:", config.url);
      console.log("Request headers:", config.headers);
      console.log("Request body:", config.data);
      return config;
    });
  }

  // Add response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: AxiosError): ApiError | never => {
      const apiError: ApiError = {
        isError: true,
        status: error.response?.status ?? 500,
        message:
          (error.response?.data as any)?.error ||
          error.message ||
          "Unknown error",
        code: (error.response?.data as any)?.code,
        details: error.response?.data,
      };

      // THROW, do NOT return
      throw apiError;
    }
  );

  return client;
};
