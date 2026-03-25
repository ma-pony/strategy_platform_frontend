import { request } from "./client";

/** GET /health — server health check */
export async function checkHealth(): Promise<{ status: string }> {
  return request<{ status: string }>("/health", { auth: false });
}
