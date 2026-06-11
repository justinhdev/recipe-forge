import type {
  CreateFoodLogRequest,
  CreateFoodLogResponse,
  DeleteFoodLogResponse,
  GetDailyTargetResponse,
  ListFoodLogsResponse,
  LoginUserRequest,
  LoginUserResponse,
} from "@recipe-forge/contracts";

import { getStoredToken } from "../auth/tokenStore";

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(
  /\/$/,
  ""
);

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
  }
}

const readErrorMessage = async (response: Response) => {
  try {
    const payload = (await response.json()) as { message?: unknown };
    return typeof payload.message === "string"
      ? payload.message
      : response.statusText;
  } catch {
    return response.statusText;
  }
};

const apiRequest = async <TResponse>(
  path: string,
  options: RequestInit & { authenticated?: boolean } = {}
) => {
  if (!configuredBaseUrl) {
    throw new ApiError(
      "Set EXPO_PUBLIC_API_BASE_URL to your laptop's LAN API URL before starting Expo.",
      0
    );
  }

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.authenticated) {
    const token = await getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${configuredBaseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  return (await response.json()) as TResponse;
};

export const login = (body: LoginUserRequest) =>
  apiRequest<LoginUserResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const getFoodLogs = (date: string) =>
  apiRequest<ListFoodLogsResponse>(
    `/api/logs?date=${encodeURIComponent(date)}`,
    {
      authenticated: true,
    }
  );

export const createFoodLog = (body: CreateFoodLogRequest) =>
  apiRequest<CreateFoodLogResponse>("/api/logs", {
    method: "POST",
    authenticated: true,
    body: JSON.stringify(body),
  });

export const deleteFoodLog = (id: number) =>
  apiRequest<DeleteFoodLogResponse>(`/api/logs/${id}`, {
    method: "DELETE",
    authenticated: true,
  });

export const getDailyTarget = () =>
  apiRequest<GetDailyTargetResponse>("/api/targets", {
    authenticated: true,
  });
