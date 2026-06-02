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
  "",
);

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function readErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { message?: unknown };
    return typeof payload.message === "string"
      ? payload.message
      : response.statusText;
  } catch {
    return response.statusText;
  }
}

async function apiRequest<TResponse>(
  path: string,
  options: RequestInit & { authenticated?: boolean } = {},
) {
  if (!configuredBaseUrl) {
    throw new ApiError(
      "Set EXPO_PUBLIC_API_BASE_URL to your laptop's LAN API URL before starting Expo.",
      0,
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
}

export function login(body: LoginUserRequest) {
  return apiRequest<LoginUserResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getFoodLogs(date: string) {
  return apiRequest<ListFoodLogsResponse>(
    `/api/logs?date=${encodeURIComponent(date)}`,
    {
      authenticated: true,
    },
  );
}

export function createFoodLog(body: CreateFoodLogRequest) {
  return apiRequest<CreateFoodLogResponse>("/api/logs", {
    method: "POST",
    authenticated: true,
    body: JSON.stringify(body),
  });
}

export function deleteFoodLog(id: number) {
  return apiRequest<DeleteFoodLogResponse>(`/api/logs/${id}`, {
    method: "DELETE",
    authenticated: true,
  });
}

export function getDailyTarget() {
  return apiRequest<GetDailyTargetResponse>("/api/targets", {
    authenticated: true,
  });
}
