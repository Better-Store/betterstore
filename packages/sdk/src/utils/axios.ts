import axios, { AxiosError, AxiosResponse } from "axios";

const API_BASE_URL = "https://api.betterstore.io/v1";

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
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });

  // Add response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: AxiosError): ApiError | never => {
      const apiError: ApiError = {
        isError: true,
        status: 500,
        message: "An unexpected error occurred",
      };

      if (error.response) {
        apiError.status = error.response.status;
        apiError.message =
          (error.response.data as { error?: string })?.error ||
          "Server error occurred";
        apiError.code = (error.response.data as { code?: string })?.code;
        apiError.details = error.response.data;
      } else if (error.request) {
        apiError.status = 503;
        apiError.message = "Service unavailable - no response from server";
        apiError.code = "SERVICE_UNAVAILABLE";
        apiError.details = error;
      } else {
        apiError.status = 500;
        apiError.message = "Request configuration error";
        apiError.code = "REQUEST_SETUP_ERROR";
        apiError.details = error;
      }

      console.error(apiError);

      if (
        apiError.code === "REQUEST_SETUP_ERROR" ||
        apiError.code === "SERVICE_UNAVAILABLE"
      ) {
        throw apiError;
      }

      return apiError;
    }
  );

  return client;
};
